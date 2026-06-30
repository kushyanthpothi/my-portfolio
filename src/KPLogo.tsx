import { motion } from 'motion/react';

export function KPLogo({ className, animate = false }: { className?: string, animate?: boolean }) {
  const pathVariants = {
    hidden: { 
      pathLength: 0, 
      fillOpacity: 0,
      strokeOpacity: 1
    },
    visible: { 
      pathLength: 1, 
      fillOpacity: 1,
      strokeOpacity: 0,
      transition: { 
        pathLength: { duration: 2, ease: "easeInOut" },
        fillOpacity: { duration: 0.5, ease: "easeIn", delay: 1.5 },
        strokeOpacity: { duration: 0.5, ease: "easeIn", delay: 1.5 }
      }
    }
  };

  return (
    <svg 
      className={className} 
      version="1.0" xmlns="http://www.w3.org/2000/svg"
      width="472.000000pt" height="482.000000pt" viewBox="0 0 472.000000 482.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(0.000000,482.000000) scale(0.100000,-0.100000)" stroke="currentColor">
        <motion.path 
          d="M620 2825 c0 -740 3 -1345 6 -1345 3 0 147 136 320 302 267 255 317 299 328 287 8 -8 170 -183 362 -389 191 -206 476 -513 633 -682 l285 -308 330 0 329 0 -119 123 c-234 239 -1461 1556 -1478 1586 -8 12 60 83 340 358 l349 343 551 0 c605 0 597 1 718 -63 32 -17 84 -57 116 -88 228 -229 199 -615 -60 -787 -117 -78 -96 -76 -728 -82 l-563 -5 217 -227 218 -228 357 0 c267 0 376 4 431 14 339 65 627 339 713 681 87 341 -1 687 -238 941 -120 128 -248 207 -437 267 -63 21 -86 21 -775 24 l-710 3 -200 -197 c-110 -108 -345 -340 -523 -515 -177 -175 -325 -318 -327 -318 -3 0 -5 371 -5 825 l0 825 -220 0 -220 0 0 -1345z"
          fill="currentColor"
          strokeWidth="20"
          variants={animate ? (pathVariants as any) : undefined}
          initial={animate ? "hidden" : undefined}
          animate={animate ? "visible" : undefined}
        />
        <motion.path 
          d="M1220 1647 c-168 -151 -551 -500 -572 -522 l-28 -28 0 -183 0 -184 80 0 81 0 364 342 364 342 -99 105 c-54 58 -111 118 -127 133 l-28 27 -35 -32z"
          fill="currentColor"
          strokeWidth="20"
          variants={animate ? (pathVariants as any) : undefined}
          initial={animate ? "hidden" : undefined}
          animate={animate ? "visible" : undefined}
        />
      </g>
    </svg>
  );
}
