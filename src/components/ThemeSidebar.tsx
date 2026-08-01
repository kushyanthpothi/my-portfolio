import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Search, Trash2, Image as ImageIcon, ExternalLink, Check } from 'lucide-react';

const themes = [
  { id: 'default', label: 'Default', accent: '#3b82f6', mid: '#1e40af' },
  { id: 'purple', label: 'Purple', accent: '#a855f7', mid: '#6b21a8' },
  { id: 'emerald', label: 'Emerald', accent: '#10b981', mid: '#047857' },
  { id: 'crimson', label: 'Crimson', accent: '#ef4444', mid: '#991b1b' },
  { id: 'silver', label: 'Silver', accent: '#94a3b8', mid: '#475569' },
  { id: 'gold', label: 'Gold', accent: '#eab308', mid: '#a16207' },
  { id: 'hologram', label: 'Hologram', accent: '#22d3ee', mid: '#0e7490' },
  { id: 'sunset', label: 'Sunset', accent: '#fcd34d', mid: '#b45309' },
];

const FALLBACK_IMAGES = [
  'https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_640.jpg',
  'https://cdn.pixabay.com/photo/2018/01/12/10/19/fantasy-3077928_640.jpg',
  'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_640.jpg',
  'https://cdn.pixabay.com/photo/2015/12/01/20/25/road-1072823_640.jpg',
  'https://cdn.pixabay.com/photo/2020/10/22/18/53/forest-5675365_640.jpg',
  'https://cdn.pixabay.com/photo/2021/08/02/01/22/evening-sky-6517529_640.jpg',
  'https://cdn.pixabay.com/photo/2019/11/05/00/10/trees-4602483_640.jpg',
  'https://cdn.pixabay.com/photo/2018/08/06/16/30/waves-3587460_640.jpg',
  'https://cdn.pixabay.com/photo/2017/12/15/13/51/polynesia-3021072_640.jpg',
  'https://cdn.pixabay.com/photo/2023/09/06/12/38/ai-generated-8236763_640.jpg',
  'https://cdn.pixabay.com/photo/2024/02/17/14/58/ai-generated-8579069_640.jpg',
  'https://cdn.pixabay.com/photo/2022/12/14/16/06/cherry-blossom-7657427_640.jpg',
];

function getBgImage(): string {
  try { return localStorage.getItem('bgImage') || ''; } catch { return ''; }
}
function saveBgImage(url: string) {
  if (url) localStorage.setItem('bgImage', url);
  else localStorage.removeItem('bgImage');
  window.dispatchEvent(new Event('bgImageChanged'));
}
function getPixabayKey(): string {
  try { return (import.meta as any).env?.VITE_PIXABAY_API_KEY || ''; } catch { return ''; }
}

interface ThemeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  themeIndex: number;
  onThemeChange: (index: number) => void;
}

export function ThemeSidebar({ isOpen, onClose, themeIndex, onThemeChange }: ThemeSidebarProps) {
  const [bgImage, setBgImageState] = useState(getBgImage);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<{ id: number; url: string; full: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'search'>('search');
  const [noKey, setNoKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setBgImageState(getBgImage());
    window.addEventListener('bgImageChanged', handler);
    return () => window.removeEventListener('bgImageChanged', handler);
  }, []);

  // Load default/popular images
  useEffect(() => {
    if (activeTab !== 'search' || searchQuery.trim()) return;
    const key = getPixabayKey();
    if (!key) {
      setNoKey(true);
      setImages(FALLBACK_IMAGES.map((url, i) => ({ id: i, url, full: url })));
      return;
    }
    setNoKey(false);
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://pixabay.com/api/?key=${key}&image_type=photo&orientation=horizontal&per_page=18&safesearch=true&order=popular`
        );
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        if (!cancelled) setImages((data.hits || []).map((h: any) => ({ id: h.id, url: h.webformatURL, full: h.largeImageURL })));
      } catch {
        if (!cancelled) {
          setImages(FALLBACK_IMAGES.map((url, i) => ({ id: i, url, full: url })));
          setNoKey(true);
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [activeTab, searchQuery]);

  // Search
  useEffect(() => {
    if (activeTab !== 'search' || !searchQuery.trim()) return;
    const key = getPixabayKey();
    if (!key) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&per_page=18&safesearch=true`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        setImages((data.hits || []).map((h: any) => ({ id: h.id, url: h.webformatURL, full: h.largeImageURL })));
      } catch (e: any) { if (e.name !== 'AbortError') { /* ignore */ } }
      setLoading(false);
    }, 400);
    return () => { clearTimeout(t); controller.abort(); };
  }, [searchQuery, activeTab]);

  const selectImage = useCallback((url: string) => {
    saveBgImage(url);
    setBgImageState(url);
  }, []);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => selectImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [selectImage]);

  const removeBackground = useCallback(() => {
    saveBgImage('');
    setBgImageState('');
  }, []);

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
            <div className="h-full flex flex-col bg-[#0a0e1a]/95 backdrop-blur-xl border-l border-white/[0.06]">
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
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
                                style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.mid})` }}
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

                  <div className="h-px bg-white/[0.06]" />

                  {/* ── Background Image Section ── */}
                  <section className="flex flex-col gap-3">
                    <h3 className="text-[11px] font-semibold tracking-widest text-white/30 uppercase">Background</h3>

                    {/* Tabs */}
                    <div className="flex p-0.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      {(['search', 'upload'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                            activeTab === tab
                              ? 'bg-white/[0.08] text-white shadow-sm'
                              : 'text-white/30 hover:text-white/50'
                          }`}
                        >
                          {tab === 'search' ? <Search className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                          {tab === 'search' ? 'Browse' : 'Upload'}
                        </button>
                      ))}
                    </div>

                    {/* Search */}
                    {activeTab === 'search' && (
                      <>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                          <input
                            type="text" value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search nature, city, abstract..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/25 outline-none bg-white/[0.04] border border-white/[0.08] focus:border-white/20 transition"
                          />
                        </div>

                        {noKey && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/25" />
                            <p className="text-[10px] text-white/25 leading-relaxed">
                              Showing curated images. For live search, get a free key at{' '}
                              <a href="https://pixabay.com/api/docs/" target="_blank" rel="noopener" className="text-white/40 underline hover:text-white/60">pixabay.com/api</a>{' '}
                              → add <code className="text-white/35 bg-white/[0.05] px-1 py-0.5 rounded">VITE_PIXABAY_API_KEY</code> to .env
                            </p>
                          </div>
                        )}

                        {loading && (
                          <div className="flex justify-center py-6">
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                          </div>
                        )}

                        {!loading && images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {images.map(img => {
                              const selected = bgImage === img.full;
                              return (
                                <button
                                  key={img.id}
                                  onClick={() => selectImage(img.full)}
                                  className={`relative aspect-[4/3] rounded-xl overflow-hidden transition-all duration-200 ${
                                    selected
                                      ? 'ring-2 ring-white/60 scale-[1.02] shadow-lg shadow-white/10'
                                      : 'ring-1 ring-white/[0.06] hover:ring-white/20 hover:scale-[1.01]'
                                  }`}
                                >
                                  <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                                  {selected && (
                                    <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                                      <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {!loading && images.length === 0 && searchQuery && (
                          <p className="text-xs text-white/25 text-center py-8">No results found</p>
                        )}
                      </>
                    )}

                    {/* Upload */}
                    {activeTab === 'upload' && (
                      <div className="flex flex-col gap-3">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full aspect-[16/10] rounded-xl border-2 border-dashed border-white/[0.1] hover:border-white/20 flex flex-col items-center justify-center gap-3 transition-all text-white/30 hover:text-white/50 bg-white/[0.02] hover:bg-white/[0.04]"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex items-center justify-center">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium">Click to upload</p>
                            <p className="text-[10px] text-white/20 mt-0.5">JPG, PNG, WebP</p>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* Current Background */}
                    {bgImage && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium">Active</p>
                          <button onClick={removeBackground} className="flex items-center gap-1 text-[10px] text-red-400/60 hover:text-red-400 transition">
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                        <div className="relative rounded-xl overflow-hidden ring-1 ring-white/[0.08]">
                          <img src={bgImage} className="w-full aspect-[16/10] object-cover" alt="Background" />
                        </div>
                      </div>
                    )}
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
