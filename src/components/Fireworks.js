'use client';

import { useEffect, useRef, useState } from 'react';
import Silk from '../Backgrounds/Silk/Silk';
import Beams from '../Backgrounds/Beams/Beams';
import Dither from '../Backgrounds/Dither/Dither';
import PixelBlast from '../Backgrounds/PixelBlast/PixelBlast';

export default function Fireworks({ 
  currentTheme = 'blue', 
  isDarkMode = false, 
  currentBackground = 'beams' 
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const fireworksRef = useRef([]);
  const particlesRef = useRef([]);
  const [isBirthday, setIsBirthday] = useState(false);

  // Test mode: Set to true to test fireworks, false for normal date checking
  const TEST_MODE = false;
  const TEST_DATE = { month: 6, date: 2 }; // June 2nd for testing (month is 0-indexed, so 5 = June)

  // Check if today is June 2nd (birthday) or test date
  useEffect(() => {
    if (TEST_MODE) {
      // Use test date
      setIsBirthday(true); // Set to true to see fireworks, false to see space animation
    } else {
      // Use actual date
      const today = new Date();
      const isJune2nd = today.getMonth() === 5 && today.getDate() === 2; // Month is 0-indexed (5 = June)
      setIsBirthday(isJune2nd);
    }
  }, []);

  // Theme colors mapping
  const themeColors = {
    blue: isDarkMode ? ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'] : ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA'],
    red: isDarkMode ? ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'] : ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'],
    purple: isDarkMode ? ['#A855F7', '#C084FC', '#DDD6FE', '#EDE9FE'] : ['#7C3AED', '#A855F7', '#C084FC', '#DDD6FE'],
    emerald: isDarkMode ? ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'] : ['#059669', '#10B981', '#34D399', '#6EE7B7'],
    orange: isDarkMode ? ['#F97316', '#FB923C', '#FDBA74', '#FED7AA'] : ['#EA580C', '#F97316', '#FB923C', '#FDBA74'],
    pink: isDarkMode ? ['#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8'] : ['#DB2777', '#EC4899', '#F472B6', '#F9A8D4']
  };
  const colors = themeColors[currentTheme] || themeColors.blue;

  class Firework {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = Math.random() * (canvas.height * 0.3) + canvas.height * 0.1;
      this.speed = Math.random() * 3 + 2;
      this.gravity = 0.02;
      this.friction = 0.99;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.trail = [];
      this.exploded = false;
      this.alpha = 1;
    }

    update() {
      if (!this.exploded) {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) this.trail.shift();

        this.y -= this.speed;
        this.speed -= this.gravity;

        if (this.speed <= 0 || this.y <= this.targetY) {
          this.explode();
        }
      }
    }

    draw(ctx) {
      if (!this.exploded) {
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          const alpha = (i / this.trail.length) * 0.8;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw main firework
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    explode() {
      this.exploded = true;
      const particleCount = Math.random() * 20 + 30;
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle(this.x, this.y, this.color));
      }
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8
      };
      this.gravity = 0.1;
      this.friction = 0.98;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.01;
      this.size = Math.random() * 3 + 1;
    }

    update() {
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;
      this.velocity.y += this.gravity;

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      this.alpha -= this.decay;
      this.size *= 0.995;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      
      // Add glow effect
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 5;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }

    isDead() {
      return this.alpha <= 0 || this.size <= 0.1;
    }
  }

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (isBirthday) {
      // Birthday fireworks animation
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw fireworks
      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const firework = fireworksRef.current[i];
        firework.update();
        firework.draw(ctx);

        if (firework.exploded) {
          fireworksRef.current.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];
        particle.update();
        particle.draw(ctx);

        if (particle.isDead()) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Create new fireworks randomly
      if (Math.random() < 0.05) {
        fireworksRef.current.push(new Firework(canvas));
      }
    } else {
      // Clear canvas for non-birthday mode (Silk background will handle the visuals)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTheme, isDarkMode, isBirthday, currentBackground]);

  return (
    <div className="fixed inset-0 z-0">
      {/* Background components - only render if not birthday */}
      {!isBirthday && (
        <>
          {currentBackground === 'beams' && (
            <Beams 
              currentTheme={currentTheme} 
              isDarkMode={isDarkMode} 
            />
          )}
          {currentBackground === 'dither' && (
            <Dither 
              currentTheme={currentTheme} 
              isDarkMode={isDarkMode} 
            />
          )}
          {currentBackground === 'silk' && (
            <Silk 
              currentTheme={currentTheme} 
              isDarkMode={isDarkMode} 
            />
          )}
          {currentBackground === 'pixelblast' && (
            <PixelBlast 
              currentTheme={currentTheme} 
              isDarkMode={isDarkMode} 
            />
          )}
        </>
      )}
      
      {/* Canvas for fireworks */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'transparent',
          opacity: isDarkMode ? 0.8 : 0.6,
          zIndex: 1
        }}
      />
    </div>
  );
}