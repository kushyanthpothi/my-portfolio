'use client';

import { useEffect, useRef, useState } from 'react';

export default function Fireworks({ currentTheme = 'blue', isDarkMode = false }) {  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const fireworksRef = useRef([]);
  const particlesRef = useRef([]);
  const beamsRef = useRef([]);
  const floatingParticlesRef = useRef([]);
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
  const colors = themeColors[currentTheme] || themeColors.blue;  // Beam class for animated beams with different shapes
  class Beam {
    constructor(canvas, existingBeams = []) {
      this.canvas = canvas;
      this.size = Math.random() * 80 + 40;
      this.minDistance = this.size * 2; // Minimum distance from other beams
      
      // Find a position that doesn't overlap with existing beams
      this.findNonOverlappingPosition(canvas, existingBeams);
      
      this.angle = Math.random() * 360;
      this.speed = Math.random() * 0.3 + 0.1;
      this.opacity = Math.random() * 0.4 + 0.2;
      this.maxOpacity = this.opacity;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.pulseSpeed = Math.random() * 0.015 + 0.005;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.shape = Math.floor(Math.random() * 4); // 0: circle, 1: square, 2: star, 3: diamond
      this.lifeTime = Math.random() * 300 + 200; // Longer life time
      this.currentLife = 0;
      this.fadeOutStart = this.lifeTime * 0.7; // Start fading at 70% of lifetime
      
      // Movement direction to avoid clustering
      this.moveX = (Math.random() - 0.5) * 0.5;
      this.moveY = (Math.random() - 0.5) * 0.5;
    }

    findNonOverlappingPosition(canvas, existingBeams) {
      let attempts = 0;
      let validPosition = false;
      
      while (!validPosition && attempts < 50) {
        this.x = Math.random() * (canvas.width - this.size * 2) + this.size;
        this.y = Math.random() * (canvas.height - this.size * 2) + this.size;
        
        validPosition = true;
        for (let beam of existingBeams) {
          const distance = Math.sqrt(
            Math.pow(this.x - beam.x, 2) + Math.pow(this.y - beam.y, 2)
          );
          if (distance < this.minDistance) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }
      
      // If couldn't find non-overlapping position, place randomly
      if (!validPosition) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }
    }

    update() {
      this.angle += this.speed;
      this.pulsePhase += this.pulseSpeed;
      this.currentLife++;
      
      // Gentle movement to prevent clustering
      this.x += this.moveX;
      this.y += this.moveY;
      
      // Bounce off edges
      if (this.x <= this.size || this.x >= this.canvas.width - this.size) {
        this.moveX *= -1;
      }
      if (this.y <= this.size || this.y >= this.canvas.height - this.size) {
        this.moveY *= -1;
      }
      
      // Keep within bounds
      this.x = Math.max(this.size, Math.min(this.canvas.width - this.size, this.x));
      this.y = Math.max(this.size, Math.min(this.canvas.height - this.size, this.y));
      
      // Smooth fade out effect
      if (this.currentLife > this.fadeOutStart) {
        const fadeProgress = (this.currentLife - this.fadeOutStart) / (this.lifeTime - this.fadeOutStart);
        this.opacity = this.maxOpacity * (1 - fadeProgress) * (0.5 + Math.sin(this.pulsePhase) * 0.3);
      } else {
        this.opacity = this.maxOpacity * (0.5 + Math.sin(this.pulsePhase) * 0.3);
      }
    }

    // ...existing drawStar, drawDiamond, draw, and isDead methods...
    drawStar(ctx, size) {
      const spikes = 5;
      const step = Math.PI / spikes;
      const innerRadius = size * 0.4;
      const outerRadius = size;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * step;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    drawDiamond(ctx, size) {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size, 0);
      ctx.closePath();
    }

    draw(ctx) {
      if (this.currentLife >= this.lifeTime) return;
      
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      
      // Create gradient for the shape
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      gradient.addColorStop(0, this.color + '60');
      gradient.addColorStop(0.5, this.color + '30');
      gradient.addColorStop(1, 'transparent');
      
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = gradient;
      ctx.strokeStyle = this.color + '80';
      ctx.lineWidth = 2;
      
      // Draw different shapes based on shape type
      switch(this.shape) {
        case 0: // Circle
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case 1: // Square
          ctx.beginPath();
          ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
          ctx.fill();
          ctx.stroke();
          break;
        case 2: // Star
          this.drawStar(ctx, this.size);
          ctx.fill();
          ctx.stroke();
          break;
        case 3: // Diamond
          this.drawDiamond(ctx, this.size);
          ctx.fill();
          ctx.stroke();
          break;
      }
      
      ctx.restore();
    }

    isDead() {
      return this.currentLife >= this.lifeTime;
    }
  }
  // Enhanced FloatingParticle class with smooth disappearing and collision avoidance
  class FloatingParticle {
    constructor(canvas, existingParticles = []) {
      this.size = Math.random() * 4 + 2;
      this.minDistance = this.size * 3; // Minimum distance from other particles
      
      // Find a position that doesn't overlap with existing particles
      this.findNonOverlappingPosition(canvas, existingParticles);
      
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.maxOpacity = this.opacity;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.shape = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
      this.lifeTime = Math.random() * 400 + 300;
      this.currentLife = 0;
      this.fadeOutStart = this.lifeTime * 0.8;
    }

    findNonOverlappingPosition(canvas, existingParticles) {
      let attempts = 0;
      let validPosition = false;
      
      while (!validPosition && attempts < 30) {
        this.x = Math.random() * (canvas.width - this.size * 2) + this.size;
        this.y = Math.random() * (canvas.height - this.size * 2) + this.size;
        
        validPosition = true;
        for (let particle of existingParticles) {
          const distance = Math.sqrt(
            Math.pow(this.x - particle.x, 2) + Math.pow(this.y - particle.y, 2)
          );
          if (distance < this.minDistance) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }
      
      // If couldn't find non-overlapping position, place randomly
      if (!validPosition) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }
    }

    update(canvas) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulsePhase += this.pulseSpeed;
      this.currentLife++;
      
      // Smooth fade out effect
      if (this.currentLife > this.fadeOutStart) {
        const fadeProgress = (this.currentLife - this.fadeOutStart) / (this.lifeTime - this.fadeOutStart);
        this.opacity = this.maxOpacity * (1 - fadeProgress) * (0.6 + Math.sin(this.pulsePhase) * 0.4);
      } else {
        this.opacity = this.maxOpacity * (0.6 + Math.sin(this.pulsePhase) * 0.4);
      }

      // Bounce off edges instead of wrapping to maintain spacing
      if (this.x <= this.size || this.x >= canvas.width - this.size) {
        this.speedX *= -0.8; // Slight dampening on bounce
        this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
      }
      if (this.y <= this.size || this.y >= canvas.height - this.size) {
        this.speedY *= -0.8;
        this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
      }
    }

    // ...existing drawTriangle, draw, and isDead methods...
    drawTriangle(ctx, size) {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.866, size * 0.5);
      ctx.lineTo(-size * 0.866, size * 0.5);
      ctx.closePath();
    }

    draw(ctx) {
      if (this.currentLife >= this.lifeTime) return;
      
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      
      ctx.translate(this.x, this.y);
      
      // Draw different shapes
      switch(this.shape) {
        case 0: // Circle
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 1: // Square
          ctx.beginPath();
          ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
          ctx.fill();
          break;
        case 2: // Triangle
          this.drawTriangle(ctx, this.size);
          ctx.fill();
          break;
      }
      
      ctx.restore();
    }

    isDead() {
      return this.currentLife >= this.lifeTime;
    }
  }

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

      // Create new fireworks randomly (more frequent on birthday)
      if (Math.random() < 0.05) {
        fireworksRef.current.push(new Firework(canvas));
      }    } else {
      // Beams animation with floating particles
      // Clear canvas with dark background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, isDarkMode ? '#0a0a0a' : '#1a1a1a');
      gradient.addColorStop(0.5, isDarkMode ? '#050505' : '#0f0f0f');
      gradient.addColorStop(1, isDarkMode ? '#000000' : '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);      // Initialize beams if not exists
      if (beamsRef.current.length === 0) {
        for (let i = 0; i < 8; i++) { // Reduced number to prevent overcrowding
          beamsRef.current.push(new Beam(canvas, beamsRef.current));
        }
      }

      // Initialize floating particles if not exists
      if (floatingParticlesRef.current.length === 0) {
        for (let i = 0; i < 25; i++) { // Reduced number to prevent overcrowding
          floatingParticlesRef.current.push(new FloatingParticle(canvas, floatingParticlesRef.current));
        }
      }

      // Update and draw beams, remove dead ones and add new ones
      for (let i = beamsRef.current.length - 1; i >= 0; i--) {
        const beam = beamsRef.current[i];
        beam.update();
        beam.draw(ctx);
        
        if (beam.isDead()) {
          beamsRef.current.splice(i, 1);
        }
      }

      // Add new beams occasionally with collision checking
      if (Math.random() < 0.015 && beamsRef.current.length < 10) {
        beamsRef.current.push(new Beam(canvas, beamsRef.current));
      }

      // Update and draw floating particles, remove dead ones and add new ones
      for (let i = floatingParticlesRef.current.length - 1; i >= 0; i--) {
        const particle = floatingParticlesRef.current[i];
        particle.update(canvas);
        particle.draw(ctx);
        
        if (particle.isDead()) {
          floatingParticlesRef.current.splice(i, 1);
        }
      }

      // Add new particles occasionally with collision checking
      if (Math.random() < 0.02 && floatingParticlesRef.current.length < 30) {
        floatingParticlesRef.current.push(new FloatingParticle(canvas, floatingParticlesRef.current));
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reinitialize beams and particles with new canvas size
    beamsRef.current = [];
    floatingParticlesRef.current = [];
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
  }, [currentTheme, isDarkMode, isBirthday]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'transparent',
        opacity: isDarkMode ? 0.8 : 0.6
      }}
    />
  );
}
