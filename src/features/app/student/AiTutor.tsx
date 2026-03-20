// src/features/app/student/AiTutor.tsx
// Replaces the existing AiTutor.tsx.
// Composes: TutorChat + TutorAvatar + GazeTrack attention monitoring.
// Pulls studentId from Vyasa's useAuthStore.

import { useState, useCallback, useEffect } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import { apiClient } from "../../../lib/api-client";
import TutorAvatar from "./tutor/TutorAvatar";
import TutorChat from "./tutor/TutorChat";
import AttentionSidebar from "../../../components/AttentionSidebar";
import AttentionPulse from "../../../components/AttentionPulse";
import AttentionToast from "../../../components/AttentionToast";
import AttentionModal from "../../../components/AttentionModal";
import CameraPermissionModal from "../../../components/CameraPermissionModal";
import { useLipSync } from "../../../hooks/useLipSync";
import { useGazeTrack, type AvatarMood } from "../../../hooks/useGazeTrack";
import type { VisualizerState } from "../../../components/AvatarVisualizer";

// AvatarVisualizer — inline since we're adapting for Vite
import AvatarVisualizer from "../../../components/AvatarVisualizer";
import { PanelLeft, PanelRight } from "lucide-react";

interface AiTutorProps {
  /** Optional topic context passed from the lesson/material route */
  topicContext?: string;
  lessonId?: string;
}

export default function AiTutor({ topicContext, lessonId }: AiTutorProps) {
  const { user } = useAuthStore();
  const studentId = user?.id ?? "anonymous";

  const [chatMood, setChatMood] = useState<AvatarMood>("neutral");
  const [isTalking, setIsTalking] = useState(false);
  const [visualizerState, setVisualizerState] =
    useState<VisualizerState>("idle");
  const lipSyncRef = useLipSync();

  // Chat collapse state
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  // Avatar expansion state (expanded = full size, collapsed = small at bottom right)
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(true);

  // Track if user submitted a query
  const [userSubmittedQuery, setUserSubmittedQuery] = useState(false);

  // ── GazeTrack ─────────────────────────────────────────────────────────────
  const handleReEngage = useCallback((prompt: string) => {
    window.dispatchEvent(
      new CustomEvent("gazetrack:reengage", { detail: { prompt } }),
    );
  }, []);

  const {
    gazeState,
    isTracking,
    gazeReady,
    cameraPermission,
    startTracking,
    stopTracking,
    dismissHardIntervention,
  } = useGazeTrack({
    studentId,
    lessonId: lessonId ?? "default",
    apiClient: { post: (url, data) => apiClient.post(url, data) },
    onSoftAlert: (s) => console.info(`[GazeTrack] Soft alert — ${s}`),
    onHardIntervention: (s) =>
      console.info(`[GazeTrack] Hard intervention — ${s}`),
    onRecovered: (s) => console.info(`[GazeTrack] Recovered — ${s}`),
    onReEngageSpeak: handleReEngage,
  });

  // Start eye tracking when user submits query or avatar starts speaking
  useEffect(() => {
    if (userSubmittedQuery && !isTracking) {
      startTracking();
      setUserSubmittedQuery(false);
    }
  }, [userSubmittedQuery, isTracking, startTracking]);

  useEffect(() => {
    if (isTalking && !isTracking) {
      startTracking();
    }
  }, [isTalking, isTracking, startTracking]);

  // Callback to signal user query submission
  const handleUserQuerySubmit = useCallback(() => {
    setUserSubmittedQuery(true);
  }, []);

  // Avatar mood: attention overrides chat mood only during Tier-2
  const activeMood: AvatarMood =
    isTracking && gazeState.tier === "hard" ? gazeState.mood : chatMood;

  return (
    <>
      {/* Tier-1: screen-edge pulse */}
      <AttentionPulse
        band={gazeState.band}
        tier={gazeState.tier}
        isTracking={isTracking}
      />

      {/* Tier-1: toast */}
      <AttentionToast
        band={gazeState.band}
        tier={gazeState.tier}
        score={gazeState.score}
        isTracking={isTracking}
      />

      {/* Tier-2: blur + modal */}
      <AttentionModal
        visible={gazeState.hardInterventionActive}
        band={gazeState.band}
        score={gazeState.score}
        onDismiss={dismissHardIntervention}
      />

      {/* Camera permission modal */}
      <CameraPermissionModal
        visible={cameraPermission === "previously_denied"}
        onClose={() => {
          /* permission state resets on next startTracking call */
        }}
        onRetry={startTracking}
      />

      {/* Layout: Chat (left, collapsible) | Avatar (bottom right, expandable) | Attention sidebar (right) */}
      <div className="h-full w-full flex overflow-hidden bg-background relative">
        {/* Chat toggle button */}
        <button
          onClick={() => setIsChatCollapsed(!isChatCollapsed)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-md hover:bg-[var(--bg-elevated)] transition-colors"
          title={isChatCollapsed ? "Expand chat" : "Collapse chat"}
        >
          <PanelLeft size={18} className="text-[var(--text-secondary)]" />
        </button>

        {/* Left: chat - collapsible */}
        <div
          className={`hidden lg:flex flex-col h-full p-4 pr-2 transition-all duration-300 ease-in-out ${
            isChatCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-[400px] shrink-0"
          }`}
        >
          <TutorChat
            onTalkingStateChange={setIsTalking}
            onMoodChange={setChatMood}
            onVisualizerStateChange={setVisualizerState}
            lipSyncRef={lipSyncRef}
            topicContext={topicContext}
            onQuerySubmit={handleUserQuerySubmit}
          />
        </div>

        {/* Mobile: chat floating at bottom */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 z-10 p-3">
          <TutorChat
            onTalkingStateChange={setIsTalking}
            onMoodChange={setChatMood}
            onVisualizerStateChange={setVisualizerState}
            lipSyncRef={lipSyncRef}
            topicContext={topicContext}
            onQuerySubmit={handleUserQuerySubmit}
          />
        </div>

        {/* Avatar area - bottom right, expandable */}
        <div
          className={`absolute transition-all duration-300 ease-in-out ${
            isAvatarExpanded
              ? "bottom-0 right-0 w-full h-full"
              : "bottom-8 right-8 w-[280px] h-[280px] cursor-pointer hover:scale-105"
          }`}
          onClick={() => !isAvatarExpanded && setIsAvatarExpanded(true)}
          style={{ zIndex: isAvatarExpanded ? 1 : 10 }}
        >
          <TutorAvatar
            isTalking={isTalking}
            mood={activeMood}
            lipSyncRef={lipSyncRef}
          />
          {/* Visualizer always visible, but positioned differently */}
          <div
            className={`z-10 ${
              isAvatarExpanded
                ? "absolute bottom-8 left-1/2 -translate-x-1/2"
                : "absolute -top-6 left-1/2 -translate-x-1/2"
            }`}
          >
            <AvatarVisualizer
              state={visualizerState}
              analyser={lipSyncRef.current.analyser}
            />
          </div>
          {/* Collapse button when expanded */}
          {isAvatarExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAvatarExpanded(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-md hover:bg-[var(--bg-elevated)] transition-colors z-20"
              title="Minimize avatar"
            >
              <PanelRight size={18} className="text-[var(--text-secondary)]" />
            </button>
          )}
        </div>

        {/* Right: attention sidebar */}
        <div className="hidden lg:flex h-full shrink-0 p-4 pl-2">
          <AttentionSidebar
            frame={gazeState.frame}
            score={gazeState.score}
            band={gazeState.band}
            tier={gazeState.tier}
            isTracking={isTracking}
            gazeReady={gazeReady}
            cameraPermission={cameraPermission}
            onStart={startTracking}
            onStop={stopTracking}
          />
        </div>
      </div>
    </>
  );
}
