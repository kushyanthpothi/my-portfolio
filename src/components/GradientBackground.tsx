import { useEffect, useState } from 'react';

function getBgImage(): string {
  try { return localStorage.getItem('bgImage') || ''; } catch { return ''; }
}

function readGradientColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    c1: s.getPropertyValue('--grad-1').trim() || '#0d47a1',
    c2: s.getPropertyValue('--grad-2').trim() || '#ff6d00',
    c3: s.getPropertyValue('--grad-3').trim() || '#00bfa5',
    c4: s.getPropertyValue('--grad-4').trim() || '#ffab00',
    c5: s.getPropertyValue('--grad-5').trim() || '#6200ea',
    bg: s.getPropertyValue('--bg-base').trim() || '#020412',
  };
}

export function GradientBackground() {
  const [colors, setColors] = useState(readGradientColors);
  const [bgImage, setBgImage] = useState(getBgImage);

  useEffect(() => {
    const handler = () => setBgImage(getBgImage());
    window.addEventListener('bgImageChanged', handler);
    return () => window.removeEventListener('bgImageChanged', handler);
  }, []);

  useEffect(() => {
    let lastTheme = document.documentElement.getAttribute('data-theme') || '';

    const check = () => {
      const current = document.documentElement.getAttribute('data-theme') || '';
      if (current !== lastTheme) {
        lastTheme = current;
        setColors(readGradientColors());
      }
    };

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="gradient-bg"
      aria-hidden="true"
      style={{ backgroundColor: colors.bg }}
    >
      {bgImage ? (
        <div
          className="gradient-bg__image"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : (
        <>
          <div
            className="gradient-bg__orb gradient-bg__orb--1"
            style={{ background: `radial-gradient(circle, ${colors.c1} 0%, transparent 70%)` }}
          />
          <div
            className="gradient-bg__orb gradient-bg__orb--2"
            style={{ background: `radial-gradient(circle, ${colors.c2} 0%, transparent 70%)` }}
          />
          <div
            className="gradient-bg__orb gradient-bg__orb--3"
            style={{ background: `radial-gradient(circle, ${colors.c3} 0%, transparent 70%)` }}
          />
          <div
            className="gradient-bg__orb gradient-bg__orb--4"
            style={{ background: `radial-gradient(circle, ${colors.c4} 0%, transparent 70%)` }}
          />
          <div
            className="gradient-bg__orb gradient-bg__orb--5"
            style={{ background: `radial-gradient(circle, ${colors.c5} 0%, transparent 70%)` }}
          />
        </>
      )}
    </div>
  );
}
