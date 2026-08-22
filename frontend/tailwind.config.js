/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Signal Blue — a deep cobalt, not the stock Material/Tailwind blue.
        // Primary actions, links, focus rings, active states.
        brand: {
          50: '#EFF5FF',
          100: '#DCEAFF',
          200: '#B9D4FF',
          300: '#8AB6FF',
          400: '#5B93FA',
          500: '#3568E0',
          600: '#2851C4',
          700: '#1F3F9E',
          800: '#1A3480',
          900: '#16296B'
        },
        // Ink — a cool navy-black surface family, coordinated with the blue
        // accent. Doubles as the light-mode neutral scale AND the dark-mode
        // surface scale (ink-900/950 = dark backgrounds, ink-50/100 = dark
        // mode text).
        ink: {
          50: '#F1F3F8',
          100: '#E1E5EE',
          200: '#C2C8D9',
          300: '#98A0B8',
          400: '#6C7690',
          500: '#4E5670',
          600: '#383F57',
          700: '#262B3E',
          800: '#181B2A',
          900: '#12141F',
          950: '#0B0D15'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        soft: '0 8px 24px rgba(11, 13, 21, 0.08)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
        },
        // Page-route entrance only — deliberately transform-only (no
        // opacity keyframe at all) so it's physically incapable of reading
        // as a fade/crossfade. The previous page is already gone by the
        // time this runs (plain unmount + mount on route change), so this
        // is purely "the new page settles into place," not a blend between
        // two layers.
        pageEnter: {
          '0%': { transform: 'translateY(14px)' },
          '100%': { transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in': 'slideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pop-in': 'popIn 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'page-enter': 'pageEnter 0.28s cubic-bezier(0.16, 1, 0.3, 1) both'
      }
    }
  },
  plugins: []
};
