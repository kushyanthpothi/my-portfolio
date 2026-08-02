import { useEffect, useRef, useCallback, type RefObject } from 'react';

export function useMouseGlow<T extends HTMLElement = HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let pendingX = 0.5;
    let pendingY = 0.5;
    let scheduled = false;

    const setPosition = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      pendingX = (clientX - rect.left) / rect.width;
      pendingY = (clientY - rect.top) / rect.height;
      if (!scheduled) {
        scheduled = true;
        rafId = requestAnimationFrame(() => {
          el.style.setProperty('--mouse-x', pendingX.toFixed(3));
          el.style.setProperty('--mouse-y', pendingY.toFixed(3));
          scheduled = false;
        });
      }
    };

    const resetPosition = () => {
      el.style.setProperty('--mouse-x', '0.5');
      el.style.setProperty('--mouse-y', '0.5');
    };

    const handleMouseMove = (e: MouseEvent) => setPosition(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) setPosition(touch.clientX, touch.clientY);
    };
    const handleMouseLeave = () => resetPosition();
    const handleTouchEnd = () => resetPosition();

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref]);

  return ref;
}
