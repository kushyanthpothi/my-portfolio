import { useEffect, useRef, type RefObject } from 'react';

export function useMouseGlow<T extends HTMLElement = HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setPosition = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width).toFixed(3);
      const y = ((clientY - rect.top) / rect.height).toFixed(3);
      el.style.setProperty('--mouse-x', x);
      el.style.setProperty('--mouse-y', y);
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

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref]);

  return ref;
}
