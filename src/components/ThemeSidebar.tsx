import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

const themes = [
  { id: 'default', label: 'Default', colors: ['#010fc8', '#3882f6', '#a855f7', '#22d3ee', '#1d4ed8'] },
  { id: 'radiance', label: 'Radiance', colors: ['#ff6d00', '#ff1744', '#ffab00', '#ff3d00', '#ffd600'] },
  { id: 'electric', label: 'Electric', colors: ['#2979ff', '#00e5ff', '#651fff', '#e040fb', '#00b0ff'] },
  { id: 'prism', label: 'Prism', colors: ['#ff1744', '#651fff', '#00e5ff', '#ffea00', '#00c853'] },
  { id: 'dazzle', label: 'Dazzle', colors: ['#ffd600', '#ff6d00', '#ff1744', '#e040fb', '#ffab00'] },
];

interface ThemeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  themeIndex: number;
  onThemeChange: (index: number) => void;
}

export function ThemeSidebar({ isOpen, onClose, themeIndex, onThemeChange }: ThemeSidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-full sm:w-[380px] max-w-full"
          >
            <div className="h-full flex flex-col bg-white/[0.04] backdrop-blur-2xl border-l border-white/[0.08]">
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] shrink-0">
                <h2 className="text-base font-semibold text-white">Customize</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {/* ── Scrollable content ── */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-5 flex flex-col gap-6">

                  {/* ── Theme Section ── */}
                  <section>
                    <h3 className="text-[11px] font-semibold tracking-widest text-white/30 uppercase mb-3">Theme</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {themes.map((t, i) => {
                        const active = themeIndex === i;
                        const gradient = `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]}, ${t.colors[2]}, ${t.colors[3]}, ${t.colors[4]})`;
                        return (
                          <button
                            key={t.id}
                            onClick={() => onThemeChange(i)}
                            className="flex flex-col items-center gap-2 group"
                          >
                            <div className="relative w-14 h-14">
                              <div
                                className={`absolute inset-0 rounded-2xl transition-all duration-200 ${
                                  active
                                    ? 'ring-2 ring-white/60 scale-110 shadow-lg shadow-white/10'
                                    : 'ring-1 ring-white/[0.1] hover:ring-white/25 hover:scale-105'
                                }`}
                                style={{ background: gradient }}
                              />
                              {active && (
                                <div className="absolute inset-0 rounded-2xl flex items-center justify-center">
                                  <div className="w-6 h-6 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                  </div>
                                </div>
                              )}
                            </div>
                            <span className={`text-[10px] font-medium leading-none ${active ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                              {t.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
