// src/features/app/student/tutor/TutorChat.tsx
// Chat interface adapted from schoolme's ChatInterface.tsx for Vyasa.
// Key differences:
//   - Uses Vyasa's api-client (axios) instead of Next.js fetch routes
//   - Reads auth from useAuthStore for student context
//   - Styled to match Vyasa's design system (shadcn/radix-ui same as schoolme)
//   - PDF viewer included (same PDF.js approach)

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  StopCircle,
  Paperclip,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  MessageSquareQuote,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { ScrollArea } from "../../../../components/ui/scroll-area"; // add if not present, or use div
import type { AvatarMood } from "../../../../hooks/useGazeTrack";
import {
  type LipSyncData,
  computeTimeline,
  stretchTimeline,
  createAnalyserForAudio,
} from "../../../../hooks/useLipSync";
import { apiClient } from "../../../../lib/api-client";

type Message = { role: "user" | "assistant"; content: string };
type ScriptItem = { text: string; mood: AvatarMood };
type View = "chat" | "pdf";
type PDFState = {
  fileName: string;
  numPages: number;
  currentPage: number;
  extractedText: string[];
  selectedText: string;
  pdfDoc: unknown;
};

export interface TutorChatProps {
  onTalkingStateChange: (v: boolean) => void;
  onMoodChange: (m: AvatarMood) => void;
  onVisualizerStateChange: (s: "idle" | "thinking" | "speaking") => void;
  lipSyncRef: React.MutableRefObject<LipSyncData>;
  /** Topic context passed in from the lesson/material */
  topicContext?: string;
}

let pdfJsLoaded = false;
async function ensurePdfJs() {
  if (pdfJsLoaded && (window as Window & { pdfjsLib?: unknown }).pdfjsLib)
    return (window as Window & { pdfjsLib: unknown }).pdfjsLib;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("PDF.js load failed"));
    document.head.appendChild(s);
  });
  const lib = (
    window as Window & {
      pdfjsLib: { GlobalWorkerOptions: { workerSrc: string } };
    }
  ).pdfjsLib;
  lib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  pdfJsLoaded = true;
  return lib;
}

export default function TutorChat({
  onTalkingStateChange,
  onMoodChange,
  onVisualizerStateChange,
  lipSyncRef,
  topicContext,
}: TutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pdf, setPdf] = useState<PDFState | null>(null);
  const [view, setView] = useState<View>("chat");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [selectionTooltip, setSelectionTooltip] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<unknown>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const vp = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (vp) (vp as HTMLElement).scrollTop = (vp as HTMLElement).scrollHeight;
    }
  }, [messages]);

  // Re-engage listener (from GazeTrack Tier-2)
  useEffect(() => {
    const handler = async (e: Event) => {
      const { prompt } = (e as CustomEvent<{ prompt: string }>).detail;
      if (isSpeaking || isLoading) return;
      onVisualizerStateChange("speaking");
      try {
        const res = await apiClient.post<{ audioBase64: string }>(
          "/api/tutor/tts",
          { text: prompt },
        );
        if (res.data?.audioBase64) {
          const bytes = Uint8Array.from(atob(res.data.audioBase64), (c) =>
            c.charCodeAt(0),
          );
          const url = URL.createObjectURL(
            new Blob([bytes], { type: "audio/mpeg" }),
          );
          const audio = new Audio(url);
          audio.onplay = () => {
            onTalkingStateChange(true);
            onMoodChange("surprise");
          };
          audio.onended = () => {
            onTalkingStateChange(false);
            onMoodChange("neutral");
            onVisualizerStateChange("idle");
            URL.revokeObjectURL(url);
          };
          audio.onerror = () => onVisualizerStateChange("idle");
          audio.play().catch(() => onVisualizerStateChange("idle"));
        } else {
          onVisualizerStateChange("idle");
        }
      } catch {
        onVisualizerStateChange("idle");
      }
    };
    window.addEventListener("gazetrack:reengage", handler);
    return () => window.removeEventListener("gazetrack:reengage", handler);
  }, [
    isSpeaking,
    isLoading,
    onTalkingStateChange,
    onMoodChange,
    onVisualizerStateChange,
  ]);

  // ── PDF rendering ──────────────────────────────────────────────────────────
  const renderPage = useCallback(async (pdfDoc: unknown, pageNum: number) => {
    if (!canvasRef.current || !textLayerRef.current || !pdfContainerRef.current)
      return;
    if (renderTaskRef.current) {
      try {
        (renderTaskRef.current as { cancel: () => void }).cancel();
      } catch {}
      renderTaskRef.current = null;
    }
    const page = await (
      pdfDoc as { getPage: (n: number) => Promise<unknown> }
    ).getPage(pageNum);
    const containerWidth = pdfContainerRef.current.clientWidth - 48;
    const baseVp = (
      page as { getViewport: (o: { scale: number }) => { width: number } }
    ).getViewport({ scale: 1 });
    const cssScale = Math.max(0.5, containerWidth / baseVp.width);
    const dpr = window.devicePixelRatio || 1;
    const viewport = (
      page as {
        getViewport: (o: { scale: number }) => {
          width: number;
          height: number;
        };
      }
    ).getViewport({ scale: cssScale * dpr });
    const canvas = canvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${Math.round(viewport.width / dpr)}px`;
    canvas.style.height = `${Math.round(viewport.height / dpr)}px`;
    const ctx = canvas.getContext("2d")!;
    const task = (
      page as { render: (o: unknown) => { promise: Promise<void> } }
    ).render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    try {
      await task.promise;
    } catch (e: unknown) {
      if ((e as { name?: string })?.name !== "RenderingCancelledException")
        console.error(e);
    }
    const tl = textLayerRef.current;
    tl.innerHTML = "";
    const cssW = Math.round(viewport.width / dpr);
    const cssH = Math.round(viewport.height / dpr);
    tl.style.cssText = `width:${cssW}px;height:${cssH}px;position:absolute;top:0;left:0;overflow:hidden;`;
    const textContent = await (
      page as { getTextContent: () => Promise<unknown> }
    ).getTextContent();
    const lib = (
      window as Window & { pdfjsLib: { renderTextLayer?: Function } }
    ).pdfjsLib;
    if (lib.renderTextLayer) {
      tl.style.setProperty("--scale-factor", String(cssScale));
      const cssVp = (
        page as { getViewport: (o: { scale: number }) => unknown }
      ).getViewport({ scale: cssScale });
      lib.renderTextLayer({
        textContentSource: textContent,
        container: tl,
        viewport: cssVp,
        textDivs: [],
      });
    }
  }, []);

  useEffect(() => {
    if (pdf && view === "pdf") renderPage(pdf.pdfDoc, pdf.currentPage);
  }, [pdf?.currentPage, view, renderPage]);

  const loadPDF = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setPdfError("Please upload a PDF file.");
      return;
    }
    setPdfError(null);
    setPdfLoading(true);
    try {
      const lib = (await ensurePdfJs()) as {
        getDocument: (o: { data: ArrayBuffer }) => {
          promise: Promise<{ numPages: number; getPage: Function }>;
        };
      };
      const buf = await file.arrayBuffer();
      const pdfDoc = await lib.getDocument({ data: buf }).promise;
      const pages: string[] = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const p = await pdfDoc.getPage(i);
        const c = await (
          p as { getTextContent: () => Promise<{ items: { str: string }[] }> }
        ).getTextContent();
        pages.push(
          c.items
            .map((x) => x.str)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim(),
        );
      }
      setPdf({
        fileName: file.name,
        numPages: pdfDoc.numPages,
        currentPage: 1,
        extractedText: pages,
        selectedText: "",
        pdfDoc,
      });
      setView("pdf");
    } catch (e) {
      setPdfError("Could not open PDF.");
      console.error(e);
    } finally {
      setPdfLoading(false);
    }
  };

  const goToPage = (d: number) => {
    if (!pdf) return;
    const n = Math.max(1, Math.min(pdf.numPages, pdf.currentPage + d));
    setPdf((p) => (p ? { ...p, currentPage: n, selectedText: "" } : p));
    setSelectionTooltip(null);
    window.getSelection()?.removeAllRanges();
  };
  const closePDF = () => {
    setPdf(null);
    setView("chat");
    setSelectionTooltip(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTextLayerMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setSelectionTooltip(null);
      setPdf((p) => (p ? { ...p, selectedText: "" } : p));
      return;
    }
    const text = sel.toString().trim();
    if (!text || text.length < 4) {
      setSelectionTooltip(null);
      return;
    }
    setPdf((p) => (p ? { ...p, selectedText: text } : p));
    try {
      const range = sel.getRangeAt(0);
      const selRect = range.getBoundingClientRect();
      const wRect = canvasWrapperRef.current?.getBoundingClientRect();
      if (wRect)
        setSelectionTooltip({
          x: selRect.left + selRect.width / 2 - wRect.left,
          y: selRect.top - wRect.top - 4,
        });
    } catch {}
  };

  const handleAskAboutSelection = () => {
    if (!pdf?.selectedText) return;
    const q = `Can you explain this passage from "${pdf.fileName}"?\n\n"${pdf.selectedText.slice(0, 400)}${pdf.selectedText.length > 400 ? "…" : ""}"`;
    setInput(q);
    setSelectionTooltip(null);
    window.getSelection()?.removeAllRanges();
    setPdf((p) => (p ? { ...p, selectedText: "" } : p));
    setView("chat");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ── Interrupt ──────────────────────────────────────────────────────────────
  const interrupt = () => {
    abortRef.current = true;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    lipSyncRef.current.isActive = false;
    lipSyncRef.current.audioElement = null;
    lipSyncRef.current.analyser = null;
    lipSyncRef.current.analyserBuffer = null;
    onTalkingStateChange(false);
    onMoodChange("neutral");
    setIsSpeaking(false);
    setIsLoading(false);
    onVisualizerStateChange("idle");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const analyzeText = (t: string): ScriptItem[] =>
    (t.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [t]).map((s) => {
      const txt = s.trim();
      let mood: AvatarMood = "neutral";
      if (txt.includes("!") || /wow|great/i.test(txt)) mood = "happy";
      else if (txt.includes("?") || /what|hmm/i.test(txt)) mood = "surprise";
      else if (/sorry|sad|serious/i.test(txt)) mood = "serious";
      return { text: txt, mood };
    });

  const fetchTTS = (text: string) =>
    apiClient
      .post<{ audioBase64: string }>("/api/tutor/tts", { text })
      .then((r) => r.data)
      .catch(() => ({ error: "TTS failed" }));

  const playSingleItem = (
    item: ScriptItem,
    tts: { audioBase64?: string; error?: string },
  ): Promise<void> =>
    new Promise((resolve) => {
      if (tts.error || !tts.audioBase64) {
        resolve();
        return;
      }
      onMoodChange(item.mood);
      const { timeline, totalDuration } = computeTimeline(item.text, 1.0);
      const bytes = Uint8Array.from(atob(tts.audioBase64), (c) =>
        c.charCodeAt(0),
      );
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "audio/mpeg" }),
      );
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      let analyser: AnalyserNode | null = null,
        analyserBuffer: Uint8Array | null = null;
      try {
        const r = createAnalyserForAudio(audio);
        analyser = r.analyser;
        analyserBuffer = r.buffer;
      } catch {}
      audio.onloadedmetadata = () => {
        if (
          lipSyncRef.current.isActive &&
          isFinite(audio.duration) &&
          audio.duration > 0
        )
          lipSyncRef.current.timeline = stretchTimeline(
            timeline,
            totalDuration,
            audio.duration,
          );
      };
      audio.onplay = () => {
        onTalkingStateChange(true);
        onVisualizerStateChange("speaking");
        const dur =
          isFinite(audio.duration) && audio.duration > 0
            ? audio.duration
            : totalDuration;
        lipSyncRef.current = {
          timeline: stretchTimeline(timeline, totalDuration, dur),
          totalDuration: dur,
          startTime: performance.now(),
          isActive: true,
          audioElement: audio,
          analyser,
          analyserBuffer,
        };
      };
      const cleanup = () => {
        onTalkingStateChange(false);
        onVisualizerStateChange("idle");
        lipSyncRef.current.isActive = false;
        lipSyncRef.current.audioElement = null;
        lipSyncRef.current.analyser = null;
        lipSyncRef.current.analyserBuffer = null;
        if (currentAudioRef.current === audio) currentAudioRef.current = null;
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onended = cleanup;
      audio.onerror = () => {
        console.error("Audio error");
        cleanup();
      };
      audio.play().catch(() => cleanup());
    });

  const playScript = async (script: ScriptItem[]) => {
    abortRef.current = false;
    setIsSpeaking(true);
    let nextFetch = fetchTTS(script[0].text);
    for (let i = 0; i < script.length; i++) {
      if (abortRef.current) break;
      const tts = await nextFetch;
      if (abortRef.current) break;
      if (i + 1 < script.length) nextFetch = fetchTTS(script[i + 1].text);
      await playSingleItem(script[i], tts as { audioBase64?: string });
      if (i < script.length - 1 && !abortRef.current)
        await new Promise((r) => setTimeout(r, 120));
    }
    if (!abortRef.current) {
      onTalkingStateChange(false);
      onMoodChange("neutral");
      onVisualizerStateChange("idle");
      setIsSpeaking(false);
      setIsLoading(false);
    }
  };

  // ── Build messages with PDF context ───────────────────────────────────────
  const buildMessages = (history: Message[], userMsg: Message) => {
    const messages = [...history, userMsg];
    if (topicContext) {
      return [
        {
          role: "system" as const,
          content: `You are an AI tutor. Topic context: ${topicContext}`,
        },
        ...messages,
      ];
    }
    if (!pdf) return messages;
    const MAX = 6000;
    const fullText = pdf.extractedText.join("\n\n--- Page Break ---\n\n");
    const parts = fullText.split("--- Page Break ---");
    const pi = pdf.currentPage - 1;
    const relevant = parts
      .slice(Math.max(0, pi - 1), pi + 3)
      .join("--- Page Break ---");
    const ctx =
      relevant.length > MAX
        ? relevant.slice(0, MAX) + "… [truncated]"
        : relevant;
    const sysContent = pdf.selectedText
      ? `PDF: "${pdf.fileName}" (page ${pdf.currentPage}/${pdf.numPages})\nSelected passage:\n"""\n${pdf.selectedText}\n"""\nContext:\n${ctx}`
      : `PDF: "${pdf.fileName}" (page ${pdf.currentPage}/${pdf.numPages})\nContext:\n${ctx}`;
    return [
      {
        role: "user" as const,
        content: `[DOCUMENT CONTEXT]\n${sysContent}\n[END CONTEXT]`,
      },
      {
        role: "assistant" as const,
        content: "I have read the document and will use it to answer.",
      },
      ...history.slice(-6),
      userMsg,
    ];
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || (isLoading && !isSpeaking)) return;
    if (isSpeaking) interrupt();
    if (!pdf) setView("chat");

    let userText = input.trim();
    if (pdf?.selectedText) {
      userText = `About: "${pdf.selectedText.slice(0, 300)}…" — ${userText}`;
      setPdf((p) => (p ? { ...p, selectedText: "" } : p));
    }

    const userMessage: Message = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    onVisualizerStateChange("thinking");

    try {
      // Chat via Vyasa backend
      const chatRes = await apiClient.post<{ content: string }>(
        "/api/tutor/chat",
        {
          messages: buildMessages(messages, userMessage),
        },
      );
      const content = chatRes.data.content;
      if (!content) throw new Error("No response");
      setMessages((prev) => [...prev, { role: "assistant", content }]);

      // Narrate via Vyasa backend
      const narrateRes = await apiClient.post<{ script: string }>(
        "/api/tutor/narrate",
        { content },
      );
      const script = narrateRes.data?.script ?? content;

      await playScript(analyzeText(script));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      setIsLoading(false);
      setIsSpeaking(false);
      onVisualizerStateChange("idle");
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-full border border-border bg-card rounded-xl overflow-hidden shadow-sm transition-all ${isDragging ? "ring-2 ring-primary/50" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) loadPDF(f);
      }}
    >
      {/* Header */}
      <div className="flex-none px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-foreground">AI Tutor</h2>
          <p className="text-xs text-muted-foreground truncate">
            {pdf ? pdf.fileName : "Deepgram TTS · Ask me anything"}
          </p>
        </div>
        {pdf && (
          <div className="flex items-center gap-1 bg-muted/50 rounded-full p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setView("pdf")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${view === "pdf" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <FileText className="w-3 h-3" /> PDF
            </button>
            <button
              type="button"
              onClick={() => setView("chat")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${view === "chat" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <MessageSquare className="w-3 h-3" /> Chat
            </button>
          </div>
        )}
        {pdf && (
          <button
            type="button"
            onClick={closePDF}
            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {/* PDF View */}
        {view === "pdf" && pdf && (
          <div className="h-full flex flex-col">
            <div className="flex-none flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
              <button
                disabled={pdf.currentPage <= 1}
                onClick={() => goToPage(-1)}
                className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-muted-foreground">
                Page {pdf.currentPage} of {pdf.numPages}
              </span>
              <button
                disabled={pdf.currentPage >= pdf.numPages}
                onClick={() => goToPage(1)}
                className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div
              className="flex-1 overflow-auto bg-neutral-200"
              ref={pdfContainerRef}
              onMouseUp={handleTextLayerMouseUp}
            >
              <div
                className="relative mx-auto my-4"
                ref={canvasWrapperRef}
                style={{ width: "fit-content" }}
              >
                <canvas
                  ref={canvasRef}
                  className="block shadow-md rounded-sm bg-white"
                />
                <div
                  ref={textLayerRef}
                  className="schoolme-text-layer select-text"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    overflow: "hidden",
                    userSelect: "text",
                    cursor: "text",
                    pointerEvents: "all",
                  }}
                />
                {selectionTooltip && (
                  <div
                    className="absolute z-50 pointer-events-auto"
                    style={{
                      left: selectionTooltip.x,
                      top: selectionTooltip.y,
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleAskAboutSelection();
                      }}
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                      <MessageSquareQuote className="w-3.5 h-3.5" /> Ask Tutor
                      about this
                    </button>
                    <div className="w-2 h-2 bg-primary rotate-45 mx-auto -mt-1 rounded-sm" />
                  </div>
                )}
              </div>
            </div>
            {pdf.selectedText && (
              <div className="flex-none px-4 py-2 border-t border-primary/20 bg-primary/5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <p className="text-[11px] text-primary/80 flex-1 truncate">
                  "{pdf.selectedText.slice(0, 90)}
                  {pdf.selectedText.length > 90 ? "…" : ""}"
                </p>
                <button
                  onClick={handleAskAboutSelection}
                  className="text-[11px] text-primary font-semibold hover:underline shrink-0"
                >
                  Ask Tutor →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chat View */}
        {view === "chat" && (
          <div className="h-full overflow-y-auto p-4 space-y-6" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center mt-20 opacity-50">
                <Bot className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-sm">
                  {pdf
                    ? `PDF loaded — ask anything about "${pdf.fileName}".`
                    : "Ask me anything — I'm here to help."}
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full border bg-muted flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-5 py-3 text-sm max-w-[85%] shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white border border-border text-foreground rounded-tl-none"}`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && !isSpeaking && (
              <div className="flex justify-start gap-3">
                <div className="w-8 h-8 rounded-full border bg-muted flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="bg-muted/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  <span className="text-xs text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {pdfLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
          </div>
        )}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 border-2 border-dashed border-primary/40 z-20 m-2 rounded-xl">
            <div className="text-center">
              <FileText className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-primary">
                Drop PDF to open
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-none p-3 pb-4 bg-card border-t border-border">
        {pdfError && (
          <p className="text-xs text-destructive mb-2 px-1">{pdfError}</p>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 items-center relative"
        >
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              pdf?.selectedText
                ? "Ask about selected text…"
                : pdf
                  ? `Ask about ${pdf.fileName}…`
                  : isSpeaking
                    ? "Type to interrupt..."
                    : "Ask anything… or drop a PDF"
            }
            disabled={isLoading && !isSpeaking}
            className="flex-1 rounded-full border border-border bg-muted/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 pr-24"
          />
          {isSpeaking && (
            <button
              type="button"
              onClick={interrupt}
              className="absolute right-20 top-1.5 h-9 w-9 flex items-center justify-center rounded-full text-destructive hover:bg-destructive/10 transition-all"
              title="Stop speaking"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title={pdf ? pdf.fileName : "Upload PDF"}
            className={`absolute right-11 top-1.5 h-9 w-9 flex items-center justify-center rounded-full transition-all ${pdf ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={(isLoading && !isSpeaking) || !input.trim()}
            className="absolute right-1.5 top-1.5 h-9 w-9 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadPDF(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
