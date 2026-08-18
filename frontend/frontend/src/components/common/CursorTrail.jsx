import { useEffect, useRef } from 'react';

const TRAIL_COLOR = '#3568E0';
// How long a point stays part of the trail before it's dropped, in ms. Short
// on purpose — this should read as a brief streak following the cursor, not
// a long snake.
const MAX_AGE = 160;
// Thicker than a normal cursor arrow, since the real OS cursor is hidden
// while the trail is active — the line needs to carry all the visual weight.
const LINE_WIDTH = 8;

// A short tapering line that follows the cursor, fading and thinning toward
// its tail (matching the reference site's trail) — not a cloud of dots.
// Mounted only inside the login page's image panel and only drawn while the
// cursor is hovering that image (see AuthLayout).
export default function CursorTrail({ active, containerRef }) {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]); // { x, y, t }
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      pointsRef.current.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        t: performance.now()
      });
    };
    container.addEventListener('pointermove', handlePointerMove);

    const tick = () => {
      const rect = container.getBoundingClientRect();
      const now = performance.now();
      // Points age out on their own, so the line shrinks away naturally
      // when the cursor stops moving instead of lingering.
      const points = pointsRef.current.filter((p) => now - p.t < MAX_AGE);
      pointsRef.current = points;

      ctx.clearRect(0, 0, rect.width, rect.height);

      if (points.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 1; i < points.length; i += 1) {
          const prev = points[i - 1];
          const curr = points[i];
          // 1 = brand new (near the cursor), 0 = about to expire (tail end).
          const strength = Math.max(0, 1 - (now - curr.t) / MAX_AGE);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.lineWidth = LINE_WIDTH * (0.3 + 0.7 * strength);
          ctx.strokeStyle = `${TRAIL_COLOR}${Math.round(strength * 255)
            .toString(16)
            .padStart(2, '0')}`;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(rafRef.current);
      pointsRef.current = [];
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
