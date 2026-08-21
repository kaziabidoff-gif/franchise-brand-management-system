import { useRef, useState } from 'react';

// Matches AuthLayout's easing so every tilting surface in the app feels like
// the same physical material.
export const SMOOTH_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
// Same accent as the login page's cursor trail — the "light" every glass
// surface catches comes from the same source.
export const GLOW_COLOR = '#3568E0';

export default function useTiltGlow(maxTilt = 7) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const onMouseMove = (event) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0 -> 1 across the element
    const py = (event.clientY - rect.top) / rect.height;

    setTilt({
      x: (0.5 - py) * 2 * maxTilt, // vertical mouse position -> rotateX
      y: (px - 0.5) * 2 * maxTilt // horizontal mouse position -> rotateY
    });
    setGlow({ x: px * 100, y: py * 100 });
  };

  const onMouseEnter = () => setHovering(true);
  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovering(false);
  };

  const tiltStyle = {
    transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
      hovering ? 'scale3d(1.015, 1.015, 1.015)' : ''
    }`,
    transition: hovering ? 'transform 80ms linear' : `transform 500ms ${SMOOTH_EASE}`
  };

  return {
    ref,
    glow,
    hovering,
    tiltStyle,
    handlers: { onMouseEnter, onMouseMove, onMouseLeave }
  };
}
