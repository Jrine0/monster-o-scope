// src/features/app/student/AiTutor.tsx
// Composes: TutorChat + TutorAvatar + GazeTrack attention monitoring.
// Pulls studentId from Vyasa's useAuthStore.

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import { apiClient } from "../../../lib/api-client";
import TutorAvatar from "./tutor/TutorAvatar";
import TutorChat from "./tutor/TutorChat";
import { useSidebar } from "./SidebarContext";
import AttentionSidebar from "../../../components/AttentionSidebar";
import AttentionPulse from "../../../components/AttentionPulse";
import AttentionToast from "../../../components/AttentionToast";
import AttentionModal from "../../../components/AttentionModal";
import CameraPermissionModal from "../../../components/CameraPermissionModal";
import { useLipSync } from "../../../hooks/useLipSync";
import { useGazeTrack, type AvatarMood } from "../../../hooks/useGazeTrack";
import type { VisualizerState } from "../../../components/AvatarVisualizer";
import AvatarVisualizer from "../../../components/AvatarVisualizer";
import { Eye, EyeOff, MessageSquare, Bot, FileText, Settings, Loader2, ChevronDown, ArrowDown, ArrowUp, Save, Trash2, Minimize2 } from "lucide-react";
import { motion } from "motion/react";

interface AiTutorProps {
  topicContext?: string;
  lessonId?: string;
}

export default function AiTutor({ topicContext, lessonId }: AiTutorProps) {
  const { user } = useAuthStore();
  const studentId = user?.id ?? "anonymous";

  const [chatMood, setChatMood] = useState<AvatarMood>("neutral");
  const [isTalking, setIsTalking] = useState(false);
  const [visualizerState, setVisualizerState] = useState<VisualizerState>("idle");
  const lipSyncRef = useLipSync();

  // Chat panel state
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatViewMode, setChatViewMode] = useState<"chat" | "documents">("chat");
  const [chatWidth, setChatWidth] = useState(400);
  const [, setIsResizing] = useState(false);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  // Chat scroll control
  const [scrollTo, setScrollTo] = useState<"top" | "bottom" | null>(null);

  // Chat clear control
  const [clearChat, setClearChat] = useState(0);

  // Avatar expansion state
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);

  // Attention panel state
  const [showAttentionPanel, setShowAttentionPanel] = useState(false);

  // Chat settings panel state
  const [showChatSettings, setShowChatSettings] = useState(false);

  // Resize handler
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = chatWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = startX - e.clientX;
      const newWidth = Math.max(250, Math.min(800, startWidth + dx));
      setChatWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [chatWidth]);

  // Collapse sidebar on mount
  const { setIsCollapsed } = useSidebar();
  useEffect(() => {
    setIsCollapsed(true);
  }, [setIsCollapsed]);

  // Draggable attention panel state
  const [attentionPosition, setAttentionPosition] = useState({ x: 0, y: 72 });
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });

  useEffect(() => {
    setAttentionPosition({ x: window.innerWidth - 296, y: 72 });
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: attentionPosition.x,
      startPosY: attentionPosition.y,
    };
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
  }, [attentionPosition]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setAttentionPosition({
      x: dragRef.current.startPosX + dx,
      y: dragRef.current.startPosY + dy,
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    dragRef.current.isDragging = false;
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
  }, [handleDragMove]);

  // Smooth loading effect
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ── GazeTrack ─────────────────────────────────────────────────────────────
  const handleReEngage = useCallback((prompt: string) => {
    window.dispatchEvent(new CustomEvent("gazetrack:reengage", { detail: { prompt } }));
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
    onHardIntervention: (s) => console.info(`[GazeTrack] Hard intervention — ${s}`),
    onRecovered: (s) => console.info(`[GazeTrack] Recovered — ${s}`),
    onReEngageSpeak: handleReEngage,
  });

  const [userSubmittedQuery, setUserSubmittedQuery] = useState(false);

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

  const handleUserQuerySubmit = useCallback(() => {
    setUserSubmittedQuery(true);
  }, []);

  const activeMood: AvatarMood =
    isTracking && gazeState.tier === "hard" ? gazeState.mood : chatMood;

  return (
    <>
      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onAnimationComplete={() => setIsLoading(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-orange-500" strokeWidth={1.5} />
            <span style={{ fontFamily: "var(--font-display)" }} className="text-lg text-text-secondary">
              Loading AI Tutor...
            </span>
          </div>
        </motion.div>
      )}

      {/* Tier-1: screen-edge pulse */}
      <AttentionPulse band={gazeState.band} tier={gazeState.tier} isTracking={isTracking} />

      {/* Tier-1: toast */}
      <AttentionToast band={gazeState.band} tier={gazeState.tier} isTracking={isTracking} />

      {/* Tier-2: blur + modal */}
      <AttentionModal visible={gazeState.hardInterventionActive} band={gazeState.band} score={gazeState.score} onDismiss={dismissHardIntervention} />

      {/* Camera permission modal */}
      <CameraPermissionModal visible={cameraPermission === "previously_denied"} onClose={() => {}} onRetry={startTracking} />

      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]"
        style={{ height: 56 }}
      >
        {/* Left: Page title */}
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[var(--text-primary)]">
            AI Tutor
          </span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Chat expand/collapse */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:bg-[var(--bg-deep)] transition-colors"
            title={isChatOpen ? "Collapse chat" : "Expand chat"}
          >
            <MessageSquare size={16} className={isChatOpen ? "text-[var(--orange)]" : "text-[var(--text-muted)]"} />
          </button>

          {/* Avatar expand/collapse */}
          <button
            onClick={() => setIsAvatarExpanded(!isAvatarExpanded)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:bg-[var(--bg-deep)] transition-colors"
            title={isAvatarExpanded ? "Collapse avatar" : "Expand avatar"}
          >
            <Bot size={16} className={isAvatarExpanded ? "text-[var(--orange)]" : "text-[var(--text-muted)]"} />
          </button>

          {/* Eye tracking toggle */}
          <button
            onClick={() => setShowAttentionPanel(!showAttentionPanel)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:bg-[var(--bg-deep)] transition-colors"
            title={showAttentionPanel ? "Hide attention panel" : "Show attention panel"}
          >
            {showAttentionPanel ? (
              <EyeOff size={16} className="text-[var(--text-secondary)]" />
            ) : (
              <Eye size={16} className="text-[var(--orange)]" />
            )}
          </button>
        </div>
      </div>

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <div className="h-full w-full flex bg-background pt-14 relative">
        {/* Chat Panel - collapses when closed */}
        {isChatOpen ? (
          <div
            ref={chatPanelRef}
            className="shrink-0 flex flex-col h-full border-r border-[var(--border-subtle)] relative"
            style={{ width: chatWidth }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
              {/* Left: View mode tabs */}
              <div className="flex items-center gap-1 bg-[var(--bg-deep)] rounded-lg p-0.5">
                <button
                  onClick={() => setChatViewMode("chat")}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors ${
                    chatViewMode === "chat"
                      ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <MessageSquare size={12} />
                </button>
                <button
                  onClick={() => setChatViewMode("documents")}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors ${
                    chatViewMode === "documents"
                      ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <FileText size={12} />
                </button>
              </div>

              {/* Center: Quick actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setScrollTo("top")}
                  className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                  title="Scroll to top"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => setScrollTo("bottom")}
                  className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                  title="Scroll to bottom"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  onClick={() => setClearChat(c => c + 1)}
                  className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                  title="Clear chat"
                >
                  <Trash2 size={12} />
                </button>
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                  title="Save chat"
                >
                  <Save size={12} />
                </button>
              </div>

              {/* Right: Settings and collapse */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowChatSettings(!showChatSettings)}
                  className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                    showChatSettings
                      ? "bg-[var(--orange)] text-black"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  }`}
                  title="Chat settings"
                >
                  <Settings size={12} />
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                  title="Collapse chat"
                >
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            {/* Chat Settings Panel */}
            {showChatSettings && (
              <div className="px-4 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                    Voice Responses
                  </span>
                  <button className="w-10 h-5 rounded-full bg-[var(--orange)] relative transition-colors">
                    <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                    Auto-scroll
                  </span>
                  <button className="w-10 h-5 rounded-full bg-[var(--orange)] relative transition-colors">
                    <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                    Sound Effects
                  </span>
                  <button className="w-10 h-5 rounded-full bg-[var(--bg-deep)] relative transition-colors">
                    <span className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-[var(--text-muted)] shadow" />
                  </button>
                </div>
              </div>
            )}

            {/* Chat/Documents Content */}
            <div className="flex-1 min-h-0">
              <TutorChat
                viewMode={chatViewMode}
                onTalkingStateChange={setIsTalking}
                onMoodChange={setChatMood}
                onVisualizerStateChange={setVisualizerState}
                lipSyncRef={lipSyncRef}
                topicContext={topicContext}
                onQuerySubmit={handleUserQuerySubmit}
                scrollTo={scrollTo}
                clearChat={clearChat}
                onScrollHandled={() => setScrollTo(null)}
              />
            </div>

            {/* Resize Handle */}
            <div
              className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-[var(--orange)] hover:bg-opacity-20 transition-colors"
              onMouseDown={handleResizeStart}
              style={{ zIndex: 10 }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-0.5 h-6 bg-[var(--border-default)] rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed chat - just a thin bar with expand button */
          <div className="shrink-0 flex flex-col h-full border-r border-[var(--border-subtle)] w-[60px] items-center py-4">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:bg-[var(--bg-deep)] transition-colors"
              title="Expand chat"
            >
              <MessageSquare size={16} className="text-[var(--text-muted)]" />
            </button>
          </div>
        )}

        {/* Avatar Area */}
        <div
          className={`flex-1 flex flex-col items-center justify-center relative transition-all duration-300 ${
            isAvatarExpanded ? "cursor-default" : "cursor-pointer"
          }`}
          onClick={() => !isAvatarExpanded && setIsAvatarExpanded(true)}
        >
          <div
            className="transition-all duration-300"
            style={{
              width: isAvatarExpanded ? "400px" : "200px",
              height: isAvatarExpanded ? "400px" : "200px",
            }}
          >
            <TutorAvatar isTalking={isTalking} mood={activeMood} lipSyncRef={lipSyncRef} />
          </div>
          <div
            className="absolute z-10 transition-all duration-300"
            style={{
              bottom: isAvatarExpanded ? "8px" : "-30px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <AvatarVisualizer state={visualizerState} analyser={lipSyncRef.current.analyser} />
          </div>
          {isAvatarExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAvatarExpanded(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-md hover:bg-[var(--bg-elevated)] transition-colors z-20"
              title="Minimize avatar"
            >
              <Minimize2 size={16} className="text-[var(--text-secondary)]" />
            </button>
          )}
          {!isAvatarExpanded && (
            <span
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[var(--text-muted)]"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}
            >
              Click to expand
            </span>
          )}
        </div>
      </div>

      {/* Floating attention panel */}
      {showAttentionPanel && (
        <div
          className="fixed z-50 rounded-xl overflow-hidden shadow-2xl"
          style={{
            top: attentionPosition.y,
            left: attentionPosition.x,
            width: 280,
            cursor: "move",
          }}
          onMouseDown={handleDragStart}
        >
          <AttentionSidebar
            frame={gazeState.frame}
            score={gazeState.score}
            band={gazeState.band}
            tier={gazeState.tier}
            isTracking={isTracking}
            gazeReady={gazeReady}
            isFloating={true}
            cameraPermission={cameraPermission}
            onStart={startTracking}
            onStop={stopTracking}
          />
        </div>
      )}
    </>
  );
}
