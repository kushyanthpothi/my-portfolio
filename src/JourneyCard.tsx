import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { createPortal } from 'react-dom';
import { ArrowRight, Pause, Play, ChevronUp, X } from 'lucide-react';

export function JourneyCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 0.04;

    const scroll = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isAutoScrolling && scrollRef.current && isExpanded) {
        scrollRef.current.scrollTop += speed * delta;
        if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight - 1) {
          setIsAutoScrolling(false);
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    if (isExpanded) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(scroll);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isExpanded, isAutoScrolling]);

  const handleUserScroll = () => {
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
    }
  };

  const toggleScroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoScrolling(!isAutoScrolling);
  };

  const closeExpanded = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsExpanded(false);
    setIsAutoScrolling(true);
  };

  return (
    <LayoutGroup>
      <motion.div 
        layoutId="journey-card"
        transition={{ type: "spring", bounce: 0.5, duration: 0.7 }}
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={`md:col-span-2 bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group cursor-pointer hover:bg-white/10 transition-colors ${isExpanded ? "opacity-0" : "opacity-100"}`}
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        <div className="flex justify-between items-start h-full gap-4 md:gap-0">
          <div className="flex-1 pr-4 md:pr-8">
            <h3 className="text-3xl font-semibold tracking-tight text-white mb-4 md:mb-6">The Journey</h3>
            <div className="space-y-3 md:space-y-6 text-white/70 text-base md:text-lg leading-relaxed">
              <p>With a strong foundation in Java, Python, and Spring Boot, I bring ideas to life through thoughtful architecture, efficient code, and scalable cloud-native solutions.</p>
              <p className="hidden sm:block">Currently, I am working as a Software Development Engineer at Ninjacart, an agri-tech company connecting farmers directly with businesses, shops, and e-commerce platforms.</p>
            </div>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-[#111] transition-colors shrink-0">
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white/70" />
          </div>
        </div>
      </motion.div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isExpanded && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={closeExpanded}
              />
              <motion.div
                layoutId="journey-card"
                transition={{ type: "spring", bounce: 0.5, duration: 0.7 }}
                className="w-full max-w-7xl h-[90vh] max-h-[900px] bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_32px_64px_0_rgba(0,0,0,0.5)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-[2.5rem] p-6 md:p-12 lg:p-16 relative overflow-hidden z-10 flex flex-col"
              >
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                
                <div className="flex justify-between items-start mb-6 shrink-0 relative z-20">
                  <h3 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">The Journey</h3>
                  <div className="flex items-center gap-2 md:gap-3">
                    <button 
                      onClick={toggleScroll}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      title={isAutoScrolling ? "Pause scrolling" : "Play scrolling"}
                    >
                      {isAutoScrolling ? <Pause className="w-4 h-4 md:w-5 md:h-5 text-white/70" /> : <Play className="w-4 h-4 md:w-5 md:h-5 text-white/70 ml-1" />}
                    </button>
                    <button 
                      onClick={closeExpanded}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      title="Close"
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6 text-white/70" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 overflow-hidden relative mt-2 md:mt-8">
                  <div className="lg:hidden shrink-0 flex flex-col items-center justify-center pt-2 md:pt-4 z-20">
                    <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] group pointer-events-auto relative">
                      <img 
                        src="https://i.ibb.co/G39RwbX6/Profile-Photo-small.jpg" 
                        alt="Kushyanth Pothineni" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Left: Auto-scrolling text */}
                  <div className="flex-1 relative flex flex-col pt-0 lg:pt-4 min-h-0">
                    <div 
                      ref={scrollRef}
                      onWheel={handleUserScroll}
                      onTouchMove={handleUserScroll}
                      className="flex-1 overflow-y-auto hide-scrollbar touch-pan-y"
                      style={{ 
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
                      }}
                    >
                      {/* Spacer to push text down initially to fade up in the center */}
                      <div className="h-[2vh] lg:h-[30vh]"></div>
                      
                      <div className="space-y-6 md:space-y-10 text-white/80 text-base md:text-2xl font-medium leading-[1.8] max-w-3xl pr-2 md:pr-6 pb-20 lg:pb-40 pt-4 pointer-events-auto">
                        <p className="text-center lg:text-left">
                          My path in software engineering began at KKR & KSR Institute of Technology and Sciences (KITS), where I studied Computer Science and Engineering. During my time there, I discovered a profound passion for building solutions that create real impact.
                        </p>
                        <p className="text-center lg:text-left">
                          I actively immersed myself in the open source community, contributing to various projects and collaborating with developers worldwide to refine my skills and understand real-world engineering practices.
                        </p>
                        <p className="text-center lg:text-left">
                          One of my defining early projects was a comprehensive event management platform designed specifically for college students. I noticed a gap in how students discovered academic and extracurricular events across different campuses.
                        </p>
                        <p className="text-center lg:text-left">
                          To bridge this, I built a centralized hub that aggregated events from various colleges. This encouraged cross-campus participation, helping students boost their extracurricular activities, build crucial skills, and expand their professional networks for their future careers.
                        </p>
                        <p className="text-center lg:text-left">
                          That momentum carried me straight into professional software development. Today, I am working as a Software Development Engineer at Ninjacart, an agri-tech company where we buy directly from farmers and sell to businesses, shops, and e-commerce platforms.
                        </p>
                        <p className="text-center lg:text-left">
                          Every project I undertake is driven by the same foundational desire:
                        </p>
                        <p className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40 pb-16 pt-12 text-center lg:text-left">
                          to engineer with purpose.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Profile Photo */}
                  <div className="hidden lg:flex w-full lg:w-[350px] shrink-0 flex-col items-center justify-center">
                    <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden relative shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10 group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 mix-blend-overlay z-10 transition-opacity duration-700 opacity-100 group-hover:opacity-0 pointer-events-none"></div>
                      <img 
                        src="https://i.ibb.co/G39RwbX6/Profile-Photo-small.jpg" 
                        alt="Kushyanth Pothineni" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-8 text-center">
                      <h4 className="text-xl font-semibold tracking-tight text-white">Kushyanth Pothineni</h4>
                      <p className="text-white/50 mt-1 uppercase text-sm tracking-widest font-medium">Software Engineer</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </LayoutGroup>
  );
}
