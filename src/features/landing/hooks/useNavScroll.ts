import { useEffect, useState, useRef } from "react";

type NavState = "visible" | "hidden";

export function useNavScroll() {
  const [scrolled,  setScrolled]  = useState(false);
  const [navState,  setNavState]  = useState<NavState>("visible");
  const lastY      = useRef(0);
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const show = () => setNavState("visible");

    const scheduleShow = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      // Show nav 600ms after scrolling stops
      idleTimer.current = setTimeout(show, 600);
    };

    const handler = () => {
      const y = window.scrollY;

      setScrolled(y > 40);

      if (y < 80) {
        // Always show near the top
        show();
        if (idleTimer.current) clearTimeout(idleTimer.current);
      } else if (y > lastY.current + 4) {
        // Scrolling down — hide
        setNavState("hidden");
        scheduleShow();
      } else if (y < lastY.current - 4) {
        // Scrolling up — show immediately
        show();
        if (idleTimer.current) clearTimeout(idleTimer.current);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return { scrolled, navState };
}