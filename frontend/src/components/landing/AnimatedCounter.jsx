import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

/**
 * Counts up from 0 to `value` every time it scrolls into view — including
 * repeat visits, not just the first time.
 */
export function AnimatedCounter({ value, suffix = "", duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
      return () => controls.stop();
    }

    // Reset so the next time it scrolls into view it counts up again
    // instead of just sitting at its final value.
    setDisplay(0);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
