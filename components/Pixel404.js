'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import styles from './Pixel404.module.css';

// High-resolution 10-col x 12-row pixel font matching the chunky image style
const DIGITS = {
  '4': [
    [0,0,1,0,0,0,0,0],
    [0,1,1,0,0,0,0,0],
    [1,1,1,0,0,0,0,0],
    [1,0,1,0,0,0,0,0],
    [1,1,1,1,1,1,1,1],
    [0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,0],
  ],
  '0': [
    [0,1,1,1,1,1,1,0],
    [1,1,0,0,0,0,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,1,1],
    [0,1,1,1,1,1,1,0],
  ],
};

// A floating particle for the disintegration effect
function DustParticle({ x, y, delay, color }) {
  const angle = Math.random() * Math.PI * 2;
  const dist = 30 + Math.random() * 60;
  const tx = Math.cos(angle) * dist;
  const ty = Math.sin(angle) * dist - 20;
  const size = 2 + Math.random() * 3;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
      animate={{
        opacity: [0, 0.9, 0.6, 0],
        x: [0, tx * 0.4, tx],
        y: [0, ty * 0.4, ty],
        scale: [1, 0.8, 0],
      }}
      transition={{
        duration: 1.5 + Math.random() * 1,
        delay,
        repeat: Infinity,
        repeatDelay: 2 + Math.random() * 3,
        ease: 'easeOut',
      }}
    />
  );
}

function Digit({ matrix, disintegrate = false, entryDelay = 0 }) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const particleRef = useRef([]);

  // Collect pixel positions for dust effect (left edge of disintegrating digit)
  useEffect(() => {
    particleRef.current = [];
  }, []);

  const dustPixels = [];
  if (disintegrate) {
    matrix.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell === 1 && ci <= 1) {
          dustPixels.push({ ri, ci });
        }
      });
    });
  }

  return (
    <div className={styles.digitWrapper}>
      {/* Pixel grid */}
      <div
        className={styles.digitGrid}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {matrix.map((row, ri) =>
          row.map((cell, ci) => {
            if (cell === 0) return <div key={`${ri}-${ci}`} className={styles.pixelEmpty} />;

            const isEdge = disintegrate && ci <= 1;
            const delay = entryDelay + ri * 0.04 + ci * 0.03;

            return (
              <motion.div
                key={`${ri}-${ci}`}
                className={`${styles.pixel} ${isEdge ? styles.pixelEdge : ''}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay, ease: [0.34, 1.2, 0.64, 1] }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default function Pixel404({ startAnimation = true }) {
  const [particles, setParticles] = useState([]);
  const [pixelColor, setPixelColor] = useState('#000000');

  useEffect(() => {
    // Read computed pixel color for particles
    const updateColor = () => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue('--pixel-color')
        .trim() || '#000000';
      setPixelColor(color);
    };
    updateColor();

    // Watch for theme changes
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Spawn dust particles for the first "4" left edge
  useEffect(() => {
    if (!startAnimation) return;
    // The first '4' occupies columns 0-7, rows 0-9, pixels are ~20px each
    // Approximate left-edge pixel positions (cols 0-1, rows 0-3)
    const PIXEL_SIZE = 20;
    const GAP = 3;
    const unit = PIXEL_SIZE + GAP;

    const edgePixels = [];
    DIGITS['4'].forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell === 1 && ci <= 1) {
          edgePixels.push({
            x: ci * unit,
            y: ri * unit,
          });
        }
      });
    });

    const makeParticles = () =>
      edgePixels.flatMap((pos) =>
        Array.from({ length: 3 }, (_, i) => ({
          id: `${pos.x}-${pos.y}-${i}-${Date.now()}`,
          x: pos.x + Math.random() * PIXEL_SIZE,
          y: pos.y + Math.random() * PIXEL_SIZE,
          delay: Math.random() * 2,
        }))
      );

    setParticles(makeParticles());
  }, [startAnimation]);

  return (
    <div className={styles.root}>
      {/* Glitch scanline overlay */}
      <div className={styles.scanlines} aria-hidden="true" />

      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 40 }}
        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        {/* First 4 — with dust particles */}
        <div style={{ position: 'relative' }}>
          <Digit matrix={DIGITS['4']} disintegrate={true} entryDelay={0.05} />
          {/* Dust particles anchored to the digit */}
          {particles.map((p) => (
            <DustParticle key={p.id} x={p.x} y={p.y} delay={p.delay} color={pixelColor} />
          ))}
        </div>

        {/* 0 */}
        <Digit matrix={DIGITS['0']} entryDelay={0.2} />

        {/* Second 4 */}
        <Digit matrix={DIGITS['4']} entryDelay={0.35} />
      </motion.div>
    </div>
  );
}
