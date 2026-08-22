import { useEffect, useRef, useState } from 'react';

/**
 * Wraps a single truncated child and shows the full text in a floating
 * popup after the pointer rests on it for a beat. Stays silent (renders
 * only the child, no listeners fired) when the child isn't actually
 * overflowing, so it never pops up for text that already fits.
 */
export default function Tooltip({ content, delay = 1000, className = '' }) {
  const [visible, setVisible] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const timerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const checkOverflow = () => {
    // content.trigger is rendered as the single child of this wrapper div;
    // it's *that* element (the actual `truncate`d node) whose scrollWidth
    // vs clientWidth tells us if text got clipped — measuring the wrapper
    // itself always reports "not overflowing" since the wrapper just grows
    // to fit whatever width its flex/grid parent gives it.
    const node = textRef.current?.firstElementChild;
    if (!node) return false;
    const isOverflowing = node.scrollWidth > node.clientWidth + 1;
    setOverflowing(isOverflowing);
    return isOverflowing;
  };

  const handleEnter = () => {
    checkOverflow();
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Re-check in case layout shifted between mouseenter and the timer firing.
      if (checkOverflow()) {
        setVisible(true);
      }
    }, delay);
  };

  const handleLeave = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <div
      className={`group/tooltip relative min-w-0 ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <div ref={textRef}>{content.trigger}</div>
      {visible && overflowing ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 max-w-xs animate-pop-in whitespace-normal break-words rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-xs font-medium leading-relaxed text-ink-100 shadow-soft dark:border-ink-600 dark:bg-ink-950"
        >
          {content.full}
        </div>
      ) : null}
    </div>
  );
}
