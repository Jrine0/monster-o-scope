// src/features/app/student/AiTutor.tsx
// Replaces the existing AiTutor.tsx.
// Composes: TutorChat + TutorAvatar + GazeTrack attention monitoring.
// Pulls studentId from Vyasa's useAuthStore.

import { useState, useRef, useCallback } from "react";
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

      {/* Layout: Chat | Avatar | Attention sidebar */}
      <div className="h-full w-full flex overflow-hidden bg-background">
        {/* Left: chat */}
        <div className="hidden lg:flex flex-col h-full w-[400px] shrink-0 p-4 pr-2">
          <TutorChat
            onTalkingStateChange={setIsTalking}
            onMoodChange={setChatMood}
            onVisualizerStateChange={setVisualizerState}
            lipSyncRef={lipSyncRef}
            topicContext={topicContext}
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
          />
        </div>

        {/* Centre: avatar */}
        <div className="flex-1 relative min-h-0 overflow-hidden">
          <TutorAvatar
            isTalking={isTalking}
            mood={activeMood}
            lipSyncRef={lipSyncRef}
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <AvatarVisualizer
              state={visualizerState}
              analyser={lipSyncRef.current.analyser}
            />
          </div>
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
