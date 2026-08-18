import { GLOW_COLOR } from '../../hooks/useTiltGlow';

export default function GlassGlow({ glow, hovering }) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(320px circle at ${glow.x}% ${glow.y}%, ${GLOW_COLOR}26, transparent 65%)`
        }}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}
        style={{
          boxShadow: `inset 0 0 0 1px ${GLOW_COLOR}4d, inset 0 1px 0 0 #ffffff26, 0 12px 28px -8px ${GLOW_COLOR}40`
        }}
      />
    </>
  );
}
