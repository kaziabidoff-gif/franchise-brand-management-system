import { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import CursorTrail from '../../components/common/CursorTrail';
import loginLight from '../../assets/login-light.jpg';
import loginDark from '../../assets/login-dark.jpg';

// ---------------------------------------------------------------------------
// To change the login page images: swap the files in src/assets/ (keeping
// the same names) or point these imports at new files. loginLight is shown
// in light mode, loginDark in dark mode — the toggle in the top-right
// corner switches between them.
// ---------------------------------------------------------------------------

// Max tilt angle (degrees) applied at the edge of the panel.
const MAX_TILT = 8;
// How much the image is scaled up so rotating it never reveals an edge.
const IMAGE_ZOOM = 1.22;
// Smooth "ease-out-expo"-style curve — quick start, long soft settle.
const SMOOTH_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function AuthLayout() {
  const panelRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveringImage, setHoveringImage] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const loginImage = theme === 'dark' ? loginDark : loginLight;

  const handleMouseMove = (event) => {
    const rect = panelRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0 -> 1 across the panel
    const py = (event.clientY - rect.top) / rect.height;
    // Image tilts "towards" the cursor: the edge nearer the mouse lifts up,
    // like it's being pulled in that direction.
    setTilt({
      x: (0.5 - py) * 2 * MAX_TILT, // vertical mouse position -> rotateX
      y: (px - 0.5) * 2 * MAX_TILT // horizontal mouse position -> rotateY
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveringImage(false);
  };

  return (
    <div className="relative grid min-h-screen bg-[#F5F7FB] dark:bg-ink-950 lg:grid-cols-[3fr_2fr]">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-white backdrop-blur-md transition hover:bg-black/30 lg:right-6 lg:top-6"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="block transition-transform duration-300" style={{ transitionTimingFunction: SMOOTH_EASE }} key={theme}>
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </span>
      </button>

      <section
        ref={panelRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHoveringImage(true)}
        onMouseLeave={handleMouseLeave}
        className={`relative hidden overflow-hidden bg-ink-950 p-10 text-white lg:flex lg:flex-col lg:justify-between ${
          hoveringImage ? 'cursor-none' : ''
        }`}
        style={{ perspective: '1200px' }}
      >
        {/* Image layer — this is the piece that tilts towards the cursor. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${loginImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${IMAGE_ZOOM}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformOrigin: 'center',
            transition: `transform 600ms ${SMOOTH_EASE}`,
            willChange: 'transform'
          }}
        />
        {/* Cursor trail — only ever visible while hovering this image panel. */}
        <CursorTrail active={hoveringImage} containerRef={panelRef} />
        <div className="pointer-events-none absolute inset-0 bg-ink-950/55" aria-hidden="true" />

        {/* Text content sits above the image and doesn't tilt. */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-brand-500" aria-hidden="true" />
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-ink-300">FBMS</p>
          </div>
          <h1 className="mt-6 max-w-lg font-display text-4xl font-bold leading-tight">
            One source of truth for how every branch shows up.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-ink-300">
            Guidelines, assets, and customization requests, kept consistent across every franchise
            location from a single console.
          </p>
        </div>
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-400">(2026) Franchise Brand Management System</p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-[#F5F7FB] p-4 dark:bg-ink-950">
        <Outlet />
      </section>
    </div>
  );
}
