import { useEffect } from 'react';

let globalLoadingCount = 0;
let isAnimating = false;
let currentSpeed = 0;
let targetSpeed = 0;
let currentOffset = 0;
let lastTime = 0;

function animateBg(time: number) {
  if (lastTime === 0) lastTime = time;
  // Cap dt to prevent huge jumps if the tab was inactive
  const dt = Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;

  // Smoothing factor (lerp)
  currentSpeed += (targetSpeed - currentSpeed) * 5 * dt;
  currentOffset += currentSpeed * dt;

  // Since CSS sets background-position to 0 0, 0 0, X 0
  // we just need to keep rolling X continuously modulo 80
  if (currentOffset >= 80) currentOffset %= 80;

  // The 3rd value in background-position is the reeded glass
  document.body.style.backgroundPosition = `0 0, 0 0, ${currentOffset}px 0`;

  // Stop the animation loop only when we rest completely
  if (targetSpeed === 0 && Math.abs(currentSpeed) < 0.5) {
    currentSpeed = 0;
    isAnimating = false;
    lastTime = 0;
    return;
  }

  requestAnimationFrame(animateBg);
}

function updateAnimation() {
  targetSpeed = globalLoadingCount > 0 ? 100 : 0; // 100px per second when loading
  if (targetSpeed > 0 && !isAnimating) {
    isAnimating = true;
    lastTime = 0;
    requestAnimationFrame(animateBg);
  }
}

export function LoadingIndicator() {
  useEffect(() => {
    globalLoadingCount++;
    updateAnimation();
    
    return () => {
      globalLoadingCount = Math.max(0, globalLoadingCount - 1);
      updateAnimation();
    };
  }, []);

  return <div className="w-full flex-1 min-h-[50vh]" />;
}

