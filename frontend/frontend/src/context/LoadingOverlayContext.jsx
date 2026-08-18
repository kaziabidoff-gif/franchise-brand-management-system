import { createContext, useCallback, useContext, useRef, useState } from 'react';
import LoadingScreen from '../components/common/LoadingScreen';

const LoadingOverlayContext = createContext(null);

// This overlay is rendered once, here, above the router — not inside the
// page that triggers it. That's the key fix for the login -> dashboard
// flicker: previously the overlay lived inside LoginPage, so the moment
// react-router swapped routes it got unmounted mid-fade, exposing a bare
// frame before DashboardLayout finished mounting. Keeping it outside the
// routed tree means it survives the swap; we navigate *while it's still
// fully opaque*, let the new route mount underneath, then fade the overlay
// out to reveal a page that's already ready.
export function LoadingOverlayProvider({ children }) {
  const [session, setSession] = useState(null); // { duration, exiting }
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const runTransition = useCallback((navigateFn, { duration = 1600 } = {}) => {
    clearTimers();
    setSession({ duration, exiting: false });

    timers.current.push(
      setTimeout(() => {
        navigateFn();
        // Give the newly-mounted route a couple of paint frames before we
        // start revealing it, so there's no gap or flash of unready UI.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setSession((current) => (current ? { ...current, exiting: true } : current));
            timers.current.push(setTimeout(() => setSession(null), 550));
          });
        });
      }, duration)
    );
  }, []);

  return (
    <LoadingOverlayContext.Provider value={{ runTransition }}>
      {children}
      {session ? <LoadingScreen exiting={session.exiting} duration={session.duration} /> : null}
    </LoadingOverlayContext.Provider>
  );
}

export const useLoadingOverlay = () => useContext(LoadingOverlayContext);
