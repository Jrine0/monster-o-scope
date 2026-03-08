import { useEffect } from "react";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const SIZE = 220;
const ORANGE = "242,116,13";

function getBtnInk() {
  // data-theme="dark" → ivory ink, data-theme="light" → dark ink
  const theme = document.documentElement.getAttribute("data-theme");
  return theme === "light" ? "30,28,24" : "237,233,223";
}

class BtnScope {
  private btn: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private angle1: number;
  private angle2: number;
  private angle3: number;
  private raf: number | null = null;
  private alive = false;
  private destroying = false;

  constructor(btn: HTMLElement) {
    this.btn = btn;
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("no ctx");
    this.ctx = ctx;
    this.canvas.width  = SIZE;
    this.canvas.height = SIZE;
    this.angle1 = Math.random() * TWO_PI;
    this.angle2 = Math.random() * TWO_PI;
    this.angle3 = Math.random() * TWO_PI;

    Object.assign(this.canvas.style, {
      position:      "absolute",
      top:           "50%",
      left:          "50%",
      width:         `${SIZE}px`,
      height:        `${SIZE}px`,
      transform:     "translate(-50%, -50%)",
      pointerEvents: "none",
      zIndex:        "1",
      opacity:       "0",
      transition:    "opacity 0.35s ease",
      mixBlendMode:  "lighten",  // visible on dark bg; "screen" goes invisible
      borderRadius:  "2px",
    });

    // relative + overflow visible so the halo can bleed outside the button edge
    if (getComputedStyle(btn).position === "static") btn.style.position = "relative";
    // overflow:hidden stays (set in CSS) — clips canvas to button bounds

    // insert behind text (::before pseudo is z-index 2 in CSS)
    btn.insertBefore(this.canvas, btn.firstChild);

    btn.addEventListener("mouseenter", this.show);
    btn.addEventListener("mouseleave", this.hide);
  }

  private show = () => {
    if (this.destroying) return;
    this.alive = true;
    this.canvas.style.opacity = "1";
    if (!this.raf) this.loop();
  };

  private hide = () => {
    this.canvas.style.opacity = "0";
    setTimeout(() => { this.alive = false; }, 400);
  };

  private loop() {
    const tick = () => {
      if (!this.alive || this.destroying) { this.raf = null; return; }
      this.angle1 += 0.009;
      this.angle2 -= 0.006;
      this.angle3 += 0.013;
      this.draw();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private draw() {
    const c  = this.ctx;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const R  = SIZE * 0.46;
    c.clearRect(0, 0, SIZE, SIZE);

    const isFilled = this.btn.classList.contains("filled");
    const baseA   = isFilled ? 0.9 : 0.75;
    const accentA = isFilled ? 1.0 : 0.9;
    const INK    = getBtnInk();
    const ink    = (a: number) => `rgba(${INK},${a})`;
    const orange = (a: number) => `rgba(${ORANGE},${a})`;

    // Concentric octagon bands
    const sides = 8;
    for (let j = 0; j < 4; j++) {
      const r   = R * lerp(1.0, 0.45, j / 3);
      const rot = this.angle1 * (j % 2 === 0 ? 1 : -1) + (j * Math.PI) / sides;
      const a   = baseA * lerp(0.7, 0.25, j / 4);
      c.beginPath();
      for (let i = 0; i <= sides; i++) {
        const ang = (i / sides) * TWO_PI + rot;
        const x   = cx + Math.cos(ang) * r;
        const y   = cy + Math.sin(ang) * r;
        i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
      }
      c.strokeStyle = j === 0 ? orange(a * 0.7) : ink(a);
      c.lineWidth   = j === 0 ? 0.7 : 0.4;
      c.stroke();
    }

    // Spokes
    for (let i = 0; i < 16; i++) {
      const a      = (i / 16) * TWO_PI + this.angle2;
      const spokeR = i % 4 === 0 ? R * 0.9 : R * 0.72;
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx + Math.cos(a) * spokeR, cy + Math.sin(a) * spokeR);
      c.strokeStyle = i % 4 === 0 ? orange(baseA * 0.5) : ink(baseA * 0.3);
      c.lineWidth   = i % 4 === 0 ? 0.5 : 0.25;
      c.stroke();
    }

    // 8-pointed star
    const starR = R * 0.3;
    c.beginPath();
    for (let i = 0; i < 16; i++) {
      const a  = (i / 16) * TWO_PI + this.angle3 - Math.PI / 2;
      const sr = i % 2 === 0 ? starR : starR * 0.42;
      i === 0 ? c.moveTo(cx + Math.cos(a) * sr, cy + Math.sin(a) * sr)
              : c.lineTo(cx + Math.cos(a) * sr, cy + Math.sin(a) * sr);
    }
    c.closePath();
    c.strokeStyle = orange(accentA);
    c.lineWidth   = 0.7;
    c.stroke();

    // Ghost offset star
    c.beginPath();
    for (let i = 0; i < 16; i++) {
      const a  = (i / 16) * TWO_PI + this.angle3 + Math.PI / 8 - Math.PI / 2;
      const sr = i % 2 === 0 ? starR : starR * 0.42;
      i === 0 ? c.moveTo(cx + Math.cos(a) * sr, cy + Math.sin(a) * sr)
              : c.lineTo(cx + Math.cos(a) * sr, cy + Math.sin(a) * sr);
    }
    c.closePath();
    c.strokeStyle = ink(baseA * 0.35);
    c.lineWidth   = 0.35;
    c.stroke();

    // Center dot
    c.beginPath();
    c.arc(cx, cy, 2.2, 0, TWO_PI);
    c.strokeStyle = orange(accentA);
    c.lineWidth   = 0.8;
    c.stroke();
  }

  destroy() {
    this.destroying = true;
    this.alive = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.btn.removeEventListener("mouseenter", this.show);
    this.btn.removeEventListener("mouseleave", this.hide);
    this.canvas.remove();
    delete (this.btn as HTMLElement & { _btnScope?: BtnScope })._btnScope;
  }
}

/**
 * Attach BtnScope kaleidoscope hover to every .sketch-btn in the DOM.
 * Pass a stable deps array (e.g. []) — re-runs whenever deps change.
 */
export function useSketchBtn(deps: unknown[] = []) {
  useEffect(() => {
    // Small delay to ensure React has finished rendering the buttons
    const id = setTimeout(() => {
      const scopes: BtnScope[] = [];
      document.querySelectorAll<HTMLElement>(".sketch-btn").forEach((btn) => {
        if ((btn as HTMLElement & { _btnScope?: BtnScope })._btnScope) return;
        try {
          const scope = new BtnScope(btn);
          (btn as HTMLElement & { _btnScope?: BtnScope })._btnScope = scope;
          scopes.push(scope);
        } catch (_) { /* skip */ }
      });
      // Store for cleanup
      (window as Window & { _sketchScopes?: BtnScope[] })._sketchScopes = scopes;
    }, 50);

    return () => {
      clearTimeout(id);
      const scopes = (window as Window & { _sketchScopes?: BtnScope[] })._sketchScopes ?? [];
      scopes.forEach((s) => s.destroy());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}