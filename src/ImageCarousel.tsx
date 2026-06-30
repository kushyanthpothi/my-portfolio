import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X } from 'lucide-react';
import { KPLogo } from './KPLogo';

interface ImageCarouselProps {
  images: string[];         // ordered list of image URLs (hero first, then contentImages)
  title: string;            // project title for alt text
  autoPlayInterval?: number; // ms, default 4000
}

export function ImageCarousel({ images, title, autoPlayInterval = 4000 }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1); // slide direction
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = images.length;

  // ── Navigation ────────────────────────────────────────────────────────────
  const go = useCallback((next: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setCurrent((next + total) % total);
  }, [total]);

  const prev = useCallback(() => go(current - 1, -1), [current, go]);
  const next = useCallback(() => go(current + 1, 1),  [current, go]);

  // ── Auto-play ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || total <= 1) return;
    timerRef.current = setInterval(() => go(current + 1, 1), autoPlayInterval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, current, total, go, autoPlayInterval]);

  // ── Keyboard handling (lightbox) ──────────────────────────────────────────
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, prev, next]);

  // Pause scrolling behind lightbox
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  // ── Preload images ────────────────────────────────────────────────────────
  useEffect(() => {
    images.forEach((src) => {
      const img = window.document.createElement('img');
      img.src = src;
    });
  }, [images]);

  if (total === 0) {
    return (
      <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-10 bg-white/5 border border-white/10 flex items-center justify-center">
        <KPLogo className="w-24 h-24 text-white/20" />
      </div>
    );
  }

  // ── Slide variants ────────────────────────────────────────────────────────
  const variants = {
    enter:  (d: number) => ({ x: d * 80, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:   (d: number) => ({ x: d * -80, opacity: 0, scale: 0.97 }),
  };

  return (
    <>
      {/* ── Carousel ────────────────────────────────────────────────────── */}
      <div className="w-full mb-10 select-none">
        <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">

          {/* Slides */}
          <AnimatePresence custom={direction} initial={false}>
            <motion.img
              key={current}
              src={images[current]}
              alt={`${title} — image ${current + 1}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
              draggable={false}
            />
          </AnimatePresence>

          {/* Gradient overlays for controls visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          {total > 1 && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
          )}

          {/* Fullscreen button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/60"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Prev / Next arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/60"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/60"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bottom bar: dots + counter + play/pause */}
          {total > 1 && (
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-10">
              {/* Dot indicators */}
              <div className="flex items-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i, i > current ? 1 : -1)}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-5 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

              {/* Counter + play/pause */}
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-xs font-medium tabular-nums">
                  {current + 1} / {total}
                </span>
                <button
                  onClick={() => setIsPlaying(p => !p)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/60 transition"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying
                    ? <Pause className="w-3.5 h-3.5 fill-white" />
                    : <Play  className="w-3.5 h-3.5 fill-white" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail strip — only if more than 2 images */}
        {total > 2 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 1 : -1)}
                className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  i === current ? 'border-white opacity-100' : 'border-white/10 opacity-50 hover:opacity-80'
                }`}
              >
                <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Fullscreen Lightbox ─────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl"
              onClick={() => setLightboxOpen(false)}
            >
              {/* Close */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev */}
              {total > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); prev(); }}
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Image (Optimized crossfade to prevent simultaneous layout calculation overhead) */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={`lb-${current}`}
                  src={images[current]}
                  alt={`${title} — image ${current + 1}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  onClick={e => e.stopPropagation()}
                  className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                  draggable={false}
                />
              </AnimatePresence>

              {/* Next */}
              {total > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); next(); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Bottom: dots + counter + play/pause */}
              <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-4">
                {total > 1 && (
                  <div className="flex items-center gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={e => { e.stopPropagation(); go(i, i > current ? 1 : -1); }}
                        className={`rounded-full transition-all duration-300 ${
                          i === current
                            ? 'w-6 h-2 bg-white'
                            : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-white/50 text-sm tabular-nums">{current + 1} / {total}</span>
                  <button
                    onClick={e => { e.stopPropagation(); setIsPlaying(p => !p); }}
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                  >
                    {isPlaying
                      ? <Pause className="w-4 h-4 fill-white" />
                      : <Play  className="w-4 h-4 fill-white" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
