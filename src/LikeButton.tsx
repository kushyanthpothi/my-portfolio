import { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from './firebase';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export function LikeButton({ introComplete }: { introComplete?: boolean }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const docRef = doc(db, 'settings', 'likes');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLikes(docSnap.data().count || 0);
        } else {
          await setDoc(docRef, { count: 0 });
        }
        
        if (localStorage.getItem('websiteLiked') === 'true') {
          setLiked(true);
        }
      } catch (error) {
        console.error("Error fetching likes", error);
      }
    };
    
    fetchLikes();
  }, []);

  const handleLike = async () => {
    if (liked) {
      setLiked(false);
      setLikes(prev => Math.max(0, prev - 1));
      localStorage.removeItem('websiteLiked');
      try {
        const docRef = doc(db, 'settings', 'likes');
        await setDoc(docRef, { count: increment(-1) }, { merge: true });
      } catch (error) {
        console.error("Error updating likes", error);
      }
      return;
    }
    
    setLiked(true);
    setShowToast(true);
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ['#ef4444', '#f87171', '#fca5a5', '#ffffff'],
        disableForReducedMotion: true,
        zIndex: 100
      });
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8, x: 0.9 },
        colors: ['#ef4444', '#f87171', '#fca5a5', '#ffffff'],
        disableForReducedMotion: true,
        zIndex: 100
      });
    }

    setTimeout(() => setShowToast(false), 2000);
    
    setLikes(prev => prev + 1);
    localStorage.setItem('websiteLiked', 'true');
    
    try {
      const docRef = doc(db, 'settings', 'likes');
      await setDoc(docRef, { count: increment(1) }, { merge: true });
    } catch (error) {
      console.error("Error updating likes", error);
    }
  };

  return (
    <AnimatePresence>
      {(introComplete || introComplete === undefined) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
        >
          <motion.button 
            ref={buttonRef}
            onClick={handleLike}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={false}
            animate={{
              width: showToast ? 300 : 56,
              paddingLeft: showToast ? 24 : 0,
              paddingRight: showToast ? 24 : 0
            }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={`relative overflow-hidden flex items-center justify-center h-14 rounded-full backdrop-blur-2xl border-[0.5px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-colors duration-500 ${
              liked 
                ? 'bg-white/10 border-red-500/30' 
                : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40 hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-full pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-full pointer-events-none"></div>
            
            <AnimatePresence>
              {showToast && (
                <motion.span
                  initial={{ opacity: 0, width: 0, marginRight: 0 }}
                  animate={{ opacity: 1, width: 220, marginRight: 12 }}
                  exit={{ opacity: 0, width: 0, marginRight: 0 }}
                  transition={{ duration: 0.3 }}
                  className="whitespace-nowrap text-white/90 text-sm font-medium z-10 overflow-hidden text-center"
                >
                  Thank you for liking our website!
                </motion.span>
              )}
            </AnimatePresence>
            
            <Heart 
              className={`w-6 h-6 transition-all duration-500 relative z-10 shrink-0 ${liked || isHovered ? 'scale-110' : ''} ${liked ? 'text-red-500 fill-red-500' : 'text-white/80'}`} 
              style={liked ? { filter: 'drop-shadow(0px 0px 8px rgba(239,68,68,0.8)) drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' } : { filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
