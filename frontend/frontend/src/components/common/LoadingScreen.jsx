import { useEffect, useState } from 'react';

const statusLines = ['Verifying credentials', 'Loading brand workspace', 'Almost there'];
// Smooth "ease-out-expo"-style curve for the wipe/fill/fade — quick start,
// long soft settle, no linear/mechanical feel.
const SMOOTH_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Controlled by the parent (LoadingOverlayContext): `exiting` drives the
// fade-out, rather than this component managing its own lifecycle. This
// lets the overlay stay mounted across a route change so the new page has
// already rendered underneath before the fade starts — no flash in between.
export default function LoadingScreen({ exiting = false, duration = 1600 }) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineIndex((index) => Math.min(index + 1, statusLines.length - 1));
    }, duration / statusLines.length);

    return () => clearInterval(lineTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-ink-950 transition-opacity duration-500 ${
        exiting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ '--loader-duration': `${duration}ms`, transitionTimingFunction: SMOOTH_EASE }}
    >
      {/* Wordmark: text-3xl (30px) -> 7.5rem (120px), 4x the original size */}
      <div className="relative flex h-32 w-full max-w-2xl items-center justify-center px-4">
        {/* Faded base layer of the wordmark, always visible */}
        <span className="loader-logo-base absolute font-display text-[7.5rem] font-bold tracking-tight text-ink-700">
          FBMS
        </span>
        {/* Solid top layer, revealed left-to-right via animated clip-path */}
        <span className="loader-logo-top absolute font-display text-[7.5rem] font-bold tracking-tight text-white">
          FBMS
        </span>
        {/* Progress bar filling in sync with the wipe */}
        <span className="loader-bar absolute inset-x-0 bottom-0 mx-auto h-2 w-48 origin-left rounded-full bg-brand-500" />
      </div>

      <div className="relative mt-12 h-4 overflow-hidden">
        {statusLines.map((line, index) => (
          <p
            key={line}
            className={`absolute inset-x-0 font-mono text-xs uppercase tracking-widest text-brand-400 transition-all duration-500 ${
              index === lineIndex ? 'translate-y-0 opacity-100' : index < lineIndex ? '-translate-y-4 opacity-0' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionTimingFunction: SMOOTH_EASE }}
          >
            {line}
          </p>
        ))}
      </div>

      <style>{`
        .loader-logo-top {
          clip-path: inset(0 100% 0 0);
          animation: loader-wipe var(--loader-duration) cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .loader-bar {
          transform: scaleX(0);
          animation: loader-fill var(--loader-duration) cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes loader-wipe {
          to { clip-path: inset(0 0% 0 0); }
        }
        @keyframes loader-fill {
          to { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .loader-logo-top { animation: none; clip-path: inset(0 0% 0 0); }
          .loader-bar { animation: none; transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
