// TutorChat.tsx — Schoolme design system
// All logic from original preserved exactly.
// className-based styling replaced with inline styles using Schoolme CSS vars.
// Fonts: Caveat (headings/labels), Lora (body/messages), Courier Prime (meta).

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
import { ScrollArea } from "../../../../components/ui/scroll-area";
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
    const cssW = Math.round(viewport.width / dpr),
      cssH = Math.round(viewport.height / dpr);
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

  const buildMessages = (history: Message[], userMsg: Message) => {
    const messages = [...history, userMsg];
    if (topicContext)
      return [
        {
          role: "system" as const,
          content: `You are an AI tutor. Topic context: ${topicContext}`,
        },
        ...messages,
      ];
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
      const chatRes = await apiClient.post<{ content: string }>(
        "/api/tutor/chat",
        { messages: buildMessages(messages, userMessage) },
      );
      const content = chatRes.data.content;
      if (!content) throw new Error("No response");
      setMessages((prev) => [...prev, { role: "assistant", content }]);
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

  /* ─── Schoolme style objects ─────────────────────────────────────────────── */
  const CLIP =
    "polygon(0.3% 0.5%,1% 0%,99% 0.3%,100% 1%,99.8% 99%,99% 100%,0.5% 99.8%,0% 99%)";
  const CLIP_SM = "polygon(1% 0%,100% 1%,99% 100%,0% 99%)";

  const f = {
    caveat: { fontFamily: "Caveat, cursive" } as React.CSSProperties,
    lora: { fontFamily: "Lora, Georgia, serif" } as React.CSSProperties,
    courier: { fontFamily: "Courier Prime, monospace" } as React.CSSProperties,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        border: isDragging
          ? "1px solid var(--orange)"
          : "1px solid var(--border-default)",
        background: "var(--bg-surface)",
        clipPath: CLIP,
        boxShadow: isDragging ? "0 0 0 2px rgba(242,116,13,0.25)" : "none",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
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
      {/* ── Header ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.7rem 1rem",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-elevated)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(242,116,13,0.10)",
            border: "1px solid rgba(242,116,13,0.22)",
            clipPath: CLIP_SM,
          }}
        >
          <Bot size={16} strokeWidth={1.5} color="var(--orange)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              ...f.caveat,
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            AI Tutor
          </div>
          <div
            style={{
              ...f.courier,
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {pdf ? pdf.fileName : "Deepgram TTS · Ask me anything"}
          </div>
        </div>

        {/* View toggle */}
        {pdf && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: "var(--bg-deep)",
              borderRadius: 6,
              padding: 2,
              border: "1px solid var(--border-subtle)",
              flexShrink: 0,
            }}
          >
            {(["pdf", "chat"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.22rem 0.65rem",
                  ...f.courier,
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  background: view === v ? "var(--bg-elevated)" : "transparent",
                  color:
                    view === v ? "var(--text-primary)" : "var(--text-muted)",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {v === "pdf" ? (
                  <FileText size={11} />
                ) : (
                  <MessageSquare size={11} />
                )}
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        {pdf && (
          <button
            type="button"
            onClick={closePDF}
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              color: "var(--text-muted)",
              clipPath: CLIP_SM,
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#f87171";
              (e.currentTarget as HTMLElement).style.borderColor = "#f87171";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "var(--text-muted)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--border-default)";
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* PDF View */}
        {view === "pdf" && pdf && (
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.35rem 0.75rem",
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-elevated)",
              }}
            >
              <button
                disabled={pdf.currentPage <= 1}
                onClick={() => goToPage(-1)}
                style={{
                  padding: "0.2rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  opacity: pdf.currentPage <= 1 ? 0.3 : 1,
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span
                style={{
                  ...f.courier,
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  color: "var(--text-secondary)",
                }}
              >
                Page {pdf.currentPage} of {pdf.numPages}
              </span>
              <button
                disabled={pdf.currentPage >= pdf.numPages}
                onClick={() => goToPage(1)}
                style={{
                  padding: "0.2rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  opacity: pdf.currentPage >= pdf.numPages ? 0.3 : 1,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div
              style={{
                flex: 1,
                overflow: "auto",
                background: "var(--bg-deep)",
              }}
              ref={pdfContainerRef}
              onMouseUp={handleTextLayerMouseUp}
            >
              <div
                ref={canvasWrapperRef}
                style={{
                  position: "relative",
                  margin: "1rem auto",
                  width: "fit-content",
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{ display: "block", background: "white" }}
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
                    style={{
                      position: "absolute",
                      zIndex: 50,
                      left: selectionTooltip.x,
                      top: selectionTooltip.y,
                      transform: "translate(-50%,-100%)",
                    }}
                  >
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleAskAboutSelection();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        background: "var(--orange)",
                        color: "#07080d",
                        ...f.courier,
                        fontSize: "0.62rem",
                        letterSpacing: "0.08em",
                        padding: "0.35rem 0.85rem",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "999px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <MessageSquareQuote size={12} /> Ask Tutor about this
                    </button>
                  </div>
                )}
              </div>
            </div>
            {pdf.selectedText && (
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  borderTop: "1px solid rgba(242,116,13,0.2)",
                  background: "rgba(242,116,13,0.05)",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--orange)",
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    ...f.lora,
                    fontStyle: "italic",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  "{pdf.selectedText.slice(0, 90)}
                  {pdf.selectedText.length > 90 ? "…" : ""}"
                </p>
                <button
                  onClick={handleAskAboutSelection}
                  style={{
                    ...f.courier,
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: "var(--orange)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  Ask Tutor →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chat View */}
        {view === "chat" && (
          <div
            ref={scrollRef}
            style={{
              height: "100%",
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  marginTop: "4rem",
                  opacity: 0.45,
                }}
              >
                <Bot size={44} strokeWidth={1} color="var(--text-muted)" />
                <p
                  style={{
                    ...f.lora,
                    fontStyle: "italic",
                    fontSize: "0.88rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.75rem",
                  }}
                >
                  {pdf
                    ? `PDF loaded — ask anything about "${pdf.fileName}".`
                    : "Ask me anything — I'm here to help."}
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  alignItems: "flex-start",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.role === "assistant" && (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      flexShrink: 0,
                      marginTop: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <Bot
                      size={14}
                      strokeWidth={1.5}
                      color="var(--text-muted)"
                    />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "0.65rem 0.95rem",
                    ...f.lora,
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                    color:
                      msg.role === "user" ? "#07080d" : "var(--text-primary)",
                    background:
                      msg.role === "user"
                        ? "var(--orange)"
                        : "var(--bg-elevated)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid var(--border-default)",
                    clipPath:
                      msg.role === "user"
                        ? "polygon(0% 0%,100% 0.5%,99.5% 99%,0.3% 100%)"
                        : "polygon(0% 0.5%,99.7% 0%,100% 100%,0.5% 99%)",
                  }}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      flexShrink: 0,
                      marginTop: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--orange)",
                    }}
                  >
                    <User size={14} strokeWidth={1.5} color="#07080d" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && !isSpeaking && (
              <div
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <Bot size={14} strokeWidth={1.5} color="var(--text-muted)" />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 0.85rem",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    clipPath: "polygon(0% 0.5%,99.7% 0%,100% 100%,0.5% 99%)",
                  }}
                >
                  <Loader2
                    size={13}
                    strokeWidth={1.5}
                    color="var(--text-muted)"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  <span
                    style={{
                      ...f.courier,
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      color: "var(--text-muted)",
                    }}
                  >
                    Thinking…
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {pdfLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(7,8,13,0.75)",
              backdropFilter: "blur(4px)",
              zIndex: 20,
            }}
          >
            <Loader2
              size={28}
              strokeWidth={1.5}
              color="var(--orange)"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        )}
        {isDragging && (
          <div
            style={{
              position: "absolute",
              inset: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(242,116,13,0.05)",
              border: "2px dashed rgba(242,116,13,0.35)",
              borderRadius: 4,
              zIndex: 20,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <FileText
                size={32}
                strokeWidth={1}
                color="var(--orange)"
                style={{ margin: "0 auto 0.5rem" }}
              />
              <p
                style={{
                  ...f.caveat,
                  fontSize: "1.1rem",
                  color: "var(--orange)",
                }}
              >
                Drop PDF to open
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "0.75rem",
          paddingBottom: "1rem",
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {pdfError && (
          <p
            style={{
              ...f.courier,
              fontSize: "0.62rem",
              color: "#f87171",
              marginBottom: "0.5rem",
            }}
          >
            {pdfError}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              pdf?.selectedText
                ? "Ask about selected text…"
                : pdf
                  ? `Ask about ${pdf.fileName}…`
                  : isSpeaking
                    ? "Type to interrupt…"
                    : "Ask anything… or drop a PDF"
            }
            disabled={isLoading && !isSpeaking}
            style={{
              flex: 1,
              ...f.lora,
              fontSize: "0.88rem",
              color: "var(--text-primary)",
              background: "var(--bg-deepest)",
              border: "1px solid var(--border-default)",
              borderRadius: "999px",
              padding: "0.6rem 1rem",
              paddingRight: "5.5rem",
              outline: "none",
              transition: "border-color 0.18s, box-shadow 0.18s",
              opacity: isLoading && !isSpeaking ? 0.5 : 1,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(242,116,13,0.45)";
              e.currentTarget.style.boxShadow =
                "0 0 18px rgba(242,116,13,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {isSpeaking && (
            <button
              type="button"
              onClick={interrupt}
              title="Stop speaking"
              style={{
                position: "absolute",
                right: "4.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#f87171",
              }}
            >
              <StopCircle size={18} strokeWidth={1.5} />
            </button>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title={pdf ? pdf.fileName : "Upload PDF"}
            style={{
              position: "absolute",
              right: "2.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: pdf ? "var(--orange)" : "var(--text-muted)",
              transition: "color 0.15s",
            }}
          >
            <Paperclip size={15} strokeWidth={1.5} />
          </button>
          <button
            type="submit"
            disabled={(isLoading && !isSpeaking) || !input.trim()}
            style={{
              position: "absolute",
              right: "0.35rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "var(--orange)",
              border: "none",
              cursor: "pointer",
              color: "#07080d",
              transition: "background 0.15s",
              opacity: (isLoading && !isSpeaking) || !input.trim() ? 0.45 : 1,
            }}
          >
            <Send size={14} strokeWidth={2} />
          </button>
        </form>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadPDF(f);
            e.target.value = "";
          }}
        />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
