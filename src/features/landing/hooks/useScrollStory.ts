import { useEffect } from "react";

const TWO_PI = Math.PI * 2;

function isDark() {
  return !document.documentElement.hasAttribute("data-theme");
}

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  w: number, h: number,
  p: number,
  lc: string,
  dark: boolean
) => void;

const drawStep0: DrawFn = (ctx, cx, cy, _w, _h, p, lc) => {
  const books = [
    { x: cx - 120, col: "rgba(242,116,13,", label: "Math" },
    { x: cx - 72, col: lc, label: "Sci" },
    { x: cx - 24, col: lc, label: "Eng" },
    { x: cx + 24, col: "rgba(242,116,13,", label: "His" },
    { x: cx + 72, col: lc, label: "Geo" },
  ];
  const baseY = cy + 80;
  books.forEach((b, i) => {
    const delay = i / books.length;
    const bp = Math.min(1, Math.max(0, (p - delay * 0.4) / 0.6));
    const bh = bp * 110 + 20;
    const bw = 32;
    ctx.strokeStyle = `${b.col}${0.55 + i * 0.04})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(b.x - bw / 2, baseY - bh, bw, bh);
    for (let l = 0; l < 3; l++) {
      const ly = baseY - bh + 12 + l * 14;
      if (ly < baseY - 4) {
        ctx.strokeStyle = `${b.col}0.25)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(b.x - bw / 2 + 4, ly);
        ctx.lineTo(b.x + bw / 2 - 4, ly);
        ctx.stroke();
      }
    }
    if (bp > 0.6) {
      ctx.fillStyle = `${b.col}0.35)`;
      ctx.font = `bold 9px "Courier Prime", monospace`;
      ctx.textAlign = "center";
      ctx.fillText(b.label, b.x, baseY - bh / 2 + 3);
    }
  });
  ctx.strokeStyle = `${lc}0.2)`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx - 160, baseY);
  ctx.lineTo(cx + 160, baseY);
  ctx.stroke();
  ctx.fillStyle = `${lc}0.3)`;
  ctx.font = `10px "Courier Prime", monospace`;
  ctx.textAlign = "center";
  ctx.fillText("NCERT Class 1–10", cx, baseY + 18);
};

const drawStep1: DrawFn = (ctx, cx, cy, _w, _h, p, lc) => {
  ctx.strokeStyle = "rgba(242,116,13,0.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx - 90, cy - 60, 22 * p, 0, TWO_PI);
  ctx.stroke();
  if (p > 0.3) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TWO_PI;
      const r1 = 26, r2 = 36;
      ctx.beginPath();
      ctx.moveTo(cx - 90 + Math.cos(a) * r1, cy - 60 + Math.sin(a) * r1);
      ctx.lineTo(cx - 90 + Math.cos(a) * r2 * p, cy - 60 + Math.sin(a) * r2 * p);
      ctx.strokeStyle = `rgba(242,116,13,${0.4 * p})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
  }
  if (p > 0.4) {
    const ap = (p - 0.4) / 0.6;
    ctx.strokeStyle = `rgba(242,116,13,${0.5 * ap})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - 90, cy - 34);
    ctx.lineTo(cx - 90, cy - 34 + 40 * ap);
    ctx.stroke();
  }
  if (p > 0.5) {
    const lp = (p - 0.5) / 0.5;
    ctx.strokeStyle = `${lc}${0.55 * lp})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20, 55 * lp, 30 * lp, -0.3, 0, TWO_PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 50 * lp, cy + 20);
    ctx.lineTo(cx + 50 * lp, cy + 20);
    ctx.strokeStyle = `rgba(242,116,13,${0.4 * lp})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
  if (p > 0.7) {
    const tp = (p - 0.7) / 0.3;
    ctx.fillStyle = `${lc}${0.45 * tp})`;
    ctx.font = `10px "Courier Prime", monospace`;
    ctx.textAlign = "left";
    ctx.fillText("CO₂ + H₂O", cx + 65, cy + 10);
    ctx.fillStyle = `rgba(242,116,13,${0.55 * tp})`;
    ctx.fillText("→ Glucose + O₂", cx + 65, cy + 24);
    ctx.fillStyle = `${lc}0.25)`;
    ctx.font = `8px "Courier Prime", monospace`;
    ctx.fillText("photosynthesis", cx + 65, cy + 40);
  }
};

const drawStep2: DrawFn = (ctx, cx, cy, _w, _h, p, lc) => {
  const cardW = 260, cardH = 160;
  const cardX = cx - cardW / 2, cardY = cy - cardH / 2 - 20;
  ctx.strokeStyle = `${lc}${0.18 * p})`;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(cardX, cardY, cardW * p, cardH * p);
  if (p > 0.2) {
    const qp = (p - 0.2) / 0.8;
    ctx.fillStyle = `${lc}${0.4 * qp})`;
    ctx.fillRect(cardX + 16, cardY + 18, 180 * qp, 5);
    ctx.fillRect(cardX + 16, cardY + 28, 140 * qp, 5);
    const opts = ["A", "B", "C", "D"];
    opts.forEach((_opt, i) => {
      const oy = cardY + 52 + i * 24;
      const op = Math.min(1, Math.max(0, (qp - i * 0.15) / 0.55));
      ctx.strokeStyle = i === 1 ? `rgba(242,116,13,${0.7 * op})` : `${lc}${0.3 * op})`;
      ctx.lineWidth = i === 1 ? 1 : 0.6;
      ctx.beginPath();
      ctx.arc(cardX + 28, oy + 4, 6, 0, TWO_PI);
      ctx.stroke();
      if (i === 1 && qp > 0.8) {
        ctx.strokeStyle = `rgba(242,116,13,0.9)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cardX + 24, oy + 4);
        ctx.lineTo(cardX + 27, oy + 7);
        ctx.lineTo(cardX + 32, oy + 1);
        ctx.stroke();
      }
      ctx.fillStyle = `${lc}${0.35 * op})`;
      ctx.fillRect(cardX + 40, oy + 2, (80 + Math.random() * 40) * op, 4);
    });
  }
  if (p > 0.85) {
    const fp = (p - 0.85) / 0.15;
    ctx.fillStyle = `rgba(242,116,13,${0.7 * fp})`;
    ctx.font = `bold 11px "Courier Prime", monospace`;
    ctx.textAlign = "center";
    ctx.fillText("✓  Correct!", cx, cardY + cardH + 22);
  }
};

const drawStep3: DrawFn = (ctx, cx, cy, _w, _h, p, lc) => {
  const nodes = [
    { x: cx - 140, y: cy + 20, done: true, label: "Ch.1" },
    { x: cx - 80, y: cy - 30, done: true, label: "Ch.2" },
    { x: cx - 10, y: cy + 10, done: true, label: "Ch.3" },
    { x: cx + 60, y: cy - 20, done: false, label: "Ch.4" },
    { x: cx + 130, y: cy + 30, done: false, label: "Ch.5" },
  ];
  for (let i = 0; i < nodes.length - 1; i++) {
    const ep = Math.min(1, Math.max(0, (p - i * 0.15) / 0.4));
    if (ep <= 0) continue;
    const n1 = nodes[i], n2 = nodes[i + 1];
    const mx = n1.x + (n2.x - n1.x) * ep;
    const my = n1.y + (n2.y - n1.y) * ep;
    ctx.strokeStyle = n1.done ? `rgba(242,116,13,${0.4 * ep})` : `${lc}${0.2 * ep})`;
    ctx.lineWidth = 0.8;
    ctx.setLineDash(n1.done ? [] : [4, 4]);
    ctx.beginPath();
    ctx.moveTo(n1.x, n1.y);
    ctx.lineTo(mx, my);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  nodes.forEach((n, i) => {
    const np = Math.min(1, Math.max(0, (p - i * 0.15) / 0.4));
    if (np <= 0) return;
    const r = 14 * np;
    ctx.strokeStyle = n.done ? `rgba(242,116,13,${0.75 * np})` : `${lc}${0.35 * np})`;
    ctx.lineWidth = n.done ? 1.2 : 0.7;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, TWO_PI);
    ctx.stroke();
    if (n.done && np > 0.5) {
      ctx.fillStyle = `rgba(242,116,13,${0.12 * np})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, TWO_PI);
      ctx.fill();
      ctx.strokeStyle = `rgba(242,116,13,${0.8 * np})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(n.x - 5, n.y);
      ctx.lineTo(n.x - 2, n.y + 4);
      ctx.lineTo(n.x + 5, n.y - 4);
      ctx.stroke();
    }
    ctx.fillStyle = n.done ? `rgba(242,116,13,${0.6 * np})` : `${lc}${0.3 * np})`;
    ctx.font = `8px "Courier Prime", monospace`;
    ctx.textAlign = "center";
    ctx.fillText(n.label, n.x, n.y + r + 12);
  });
  if (p > 0.7) {
    const lp = (p - 0.7) / 0.3;
    ctx.fillStyle = `${lc}${0.3 * lp})`;
    ctx.font = `9px "Courier Prime", monospace`;
    ctx.textAlign = "center";
    ctx.fillText("3 / 5 chapters complete", cx, cy + 80);
  }
};

const DRAW_FNS = [drawStep0, drawStep1, drawStep2, drawStep3];
const STEPS = 4;

export function useScrollStory(sectionId: string) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    const canvas = document.getElementById("ss-canvas") as HTMLCanvasElement | null;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const panels = document.querySelectorAll<HTMLElement>(".ss-panel");
    const overlays = document.querySelectorAll<HTMLElement>(".ss-overlay");
    const dots = document.querySelectorAll<HTMLElement>(".ss-dot");

    let current = -1;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      draw(current < 0 ? 0 : current, 1);
    }

    function draw(step: number, progress: number) {
      if (!ctx) return;
      const W = canvas!.width, H = canvas!.height;
      const dpr = window.devicePixelRatio || 1;
      const dark = isDark();
      const bg = dark ? "#12141e" : "#eceae3";
      const lineCol = dark ? "rgba(237,233,223," : "rgba(30,28,24,";

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = dark ? "rgba(237,233,223,0.04)" : "rgba(30,28,24,0.04)";
      ctx.lineWidth = 0.5 * dpr;
      const gs = 32 * dpr;
      for (let x = 0; x < W; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const w = W / dpr, h = H / dpr, cx = w / 2, cy = h / 2;
      const p = Math.min(1, Math.max(0, progress));

      if (step >= 0 && step < STEPS) {
        DRAW_FNS[step](ctx, cx, cy, w, h, p, lineCol, dark);
      }
      ctx.restore();
    }

    function activate(step: number) {
      if (step === current) return;
      current = step;
      panels.forEach((p, i) => p.classList.toggle("active", i === step));
      overlays.forEach((o, i) => o.classList.toggle("active", i === step));
      dots.forEach((d, i) => d.classList.toggle("active", i === step));
      draw(step, 1);
    }

    function onScroll() {
      const rect = section!.getBoundingClientRect();
      const total = section!.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / total));
      const step = Math.min(STEPS - 1, Math.floor(progress * STEPS));
      activate(step);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    activate(0);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [sectionId]);
}
