import {
  FiAward,
  FiBarChart2,
  FiBook,
  FiCalendar,
  FiCamera,
  FiClipboard,
  FiFile,
  FiFileText,
  FiImage,
  FiLayout,
  FiMail,
  FiMapPin,
  FiMonitor,
  FiPrinter,
  FiSettings,
  FiShare2,
  FiTarget,
  FiVideo
} from 'react-icons/fi';
import useTiltGlow from '../../hooks/useTiltGlow';

// One fixed icon + tone + glow color per category (matches
// constants/options.js assetCategories) — a deterministic visual per asset
// type. `glow` is a raw hex approximating the tone's color family, used for
// the hover light-catching effect (so a violet icon catches violet light).
const categoryConfig = {
  Logo: { icon: FiAward, tone: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300', glow: '#7C3AED' },
  Social: { icon: FiShare2, tone: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300', glow: '#DB2777' },
  Poster: { icon: FiLayout, tone: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300', glow: '#2563EB' },
  Banner: { icon: FiImage, tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300', glow: '#4F46E5' },
  Template: { icon: FiMonitor, tone: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300', glow: '#D97706' },
  Guideline: { icon: FiBook, tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300', glow: '#059669' },
  Flyer: { icon: FiFileText, tone: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300', glow: '#EA580C' },
  Print: { icon: FiPrinter, tone: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300', glow: '#4E5670' },
  Outdoor: { icon: FiMapPin, tone: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300', glow: '#0D9488' },
  Photography: { icon: FiCamera, tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300', glow: '#E11D48' },
  Operations: { icon: FiSettings, tone: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300', glow: '#4E5670' },
  Video: { icon: FiVideo, tone: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300', glow: '#DC2626' },
  Email: { icon: FiMail, tone: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300', glow: '#0284C7' },
  Presentation: { icon: FiBarChart2, tone: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300', glow: '#9333EA' },
  Document: { icon: FiClipboard, tone: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300', glow: '#2563EB' },
  Campaign: { icon: FiTarget, tone: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300', glow: '#3568E0' },
  Event: { icon: FiCalendar, tone: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-300', glow: '#16A34A' }
};

const defaultConfig = { icon: FiFile, tone: 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400', glow: '#78766B' };

export default function AssetThumbnail({ asset, className = 'h-12 w-16' }) {
  const config = categoryConfig[asset.category] || defaultConfig;
  const Icon = config.icon;
  // Smaller max tilt than the big stat cards — this is a small chip, not a panel.
  const { ref, glow, hovering, tiltStyle, handlers } = useTiltGlow(9);

  return (
    <span
      ref={ref}
      {...handlers}
      style={tiltStyle}
      className={`${className} relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md ${config.tone}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: `radial-gradient(60px circle at ${glow.x}% ${glow.y}%, ${config.glow}59, transparent 70%)` }}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-md transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}
        style={{ boxShadow: `inset 0 0 0 1px ${config.glow}66, inset 0 1px 0 0 #ffffff40` }}
      />
      <Icon className="relative h-5 w-5" />
    </span>
  );
}
