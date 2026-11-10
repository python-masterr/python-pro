/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Galaxy Canvas Background & Celestial Cursor Tracker
 * Features:
 * - 80+ dynamic galaxy stars with velocity, boundary wrapping, and constellation connecting lines
 * - Dynamic mouse gravity repulsion physics
 * - Smooth lerped cursor aura & core with dual theme support (Cosmic Cyan/Magenta vs Gold/Emerald)
 * - Micro stardust particle trails emitted on mouse movement
 * - Synthesized Audio SFX floating toast HUD with active equalizer bars
 */

import React, { useEffect, useRef, useState } from 'react';
import { cosmicAudio, ToastNotification } from '../utils/cosmicAudio';
import { Sparkles, Sun, Volume2, Trophy, Music } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
}

interface StardustMote {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const GalaxyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);

  const [activeTheme, setActiveTheme] = useState<'cyan' | 'gold'>('cyan');
  const [activeToast, setActiveToast] = useState<ToastNotification | null>(null);
  const [motes, setMotes] = useState<StardustMote[]>([]);
  const moteIdCounter = useRef(0);

  // Subscribe to theme and toast events
  useEffect(() => {
    setActiveTheme(cosmicAudio.currentTheme);
    const unsubToast = cosmicAudio.subscribeToast((toast) => {
      setActiveToast(toast);
      const timer = setTimeout(() => {
        setActiveToast((current) => (current?.id === toast.id ? null : current));
      }, 2600);
      return () => clearTimeout(timer);
    });

    return () => {
      unsubToast();
    };
  }, []);

  // Update theme when cosmicAudio changes theme
  useEffect(() => {
    const handleThemeCheck = () => {
      if (cosmicAudio.currentTheme !== activeTheme) {
        setActiveTheme(cosmicAudio.currentTheme);
      }
    };
    const interval = setInterval(handleThemeCheck, 400);
    return () => clearInterval(interval);
  }, [activeTheme]);

  // Canvas starfield simulation and cursor tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const count = Math.min(85, Math.floor(window.innerWidth / 18));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let curX = -1000;
    let curY = -1000;
    let lastMoteTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (auraRef.current) auraRef.current.style.opacity = '1';
      if (coreRef.current) coreRef.current.style.opacity = '1';

      // Emit stardust motes on cursor movement (throttled to every 45ms)
      const now = performance.now();
      if (now - lastMoteTime > 45) {
        lastMoteTime = now;
        const isGold = cosmicAudio.currentTheme === 'gold';
        const newMote: StardustMote = {
          id: ++moteIdCounter.current,
          x: mouseX + (Math.random() - 0.5) * 14,
          y: mouseY + (Math.random() - 0.5) * 14,
          size: Math.random() * 4 + 2,
          color: isGold
            ? Math.random() > 0.5
              ? '#fbbf24'
              : '#10b981'
            : Math.random() > 0.5
            ? '#38bdf8'
            : '#d946ef',
        };
        setMotes((prev) => [...prev.slice(-12), newMote]);
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      if (auraRef.current) auraRef.current.style.opacity = '0';
      if (coreRef.current) coreRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp for cursor aura
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;

      if (auraRef.current) {
        auraRef.current.style.left = `${curX}px`;
        auraRef.current.style.top = `${curY}px`;
      }
      if (coreRef.current) {
        coreRef.current.style.left = `${mouseX}px`;
        coreRef.current.style.top = `${mouseY}px`;
      }

      const isGold = cosmicAudio.currentTheme === 'gold';
      const pColor = isGold ? 'rgba(251, 191, 36,' : 'rgba(56, 189, 248,';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Repulsion physics from mouse cursor
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110 && dist > 0) {
          const force = (110 - dist) / 110;
          p.x += (dx / dist) * force * 2.8;
          p.y += (dy / dist) * force * 2.8;
        }

        // Draw star particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${pColor} ${p.alpha})`;
        ctx.fill();

        // Connect nearby stars with constellation lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${pColor} ${(1 - d / 85) * 0.16})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Clean up older motes automatically
  useEffect(() => {
    if (motes.length === 0) return;
    const timeout = setTimeout(() => {
      setMotes((prev) => prev.slice(1));
    }, 450);
    return () => clearTimeout(timeout);
  }, [motes]);

  const isGold = activeTheme === 'gold';

  return (
    <>
      {/* Dynamic Stardust Canvas */}
      <canvas
        ref={canvasRef}
        id="galaxy-dots-canvas"
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Nebula Ambient Glow Blobs */}
      <div
        id="nebula-blob-1"
        className={`fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none -z-10 transition-all duration-700 ${
          isGold
            ? 'bg-gradient-to-br from-yellow-500/15 via-emerald-600/15 to-transparent'
            : 'bg-gradient-to-br from-cyan-500/20 via-purple-600/15 to-transparent'
        }`}
        style={{
          animation: 'nebula-pulse 8s ease-in-out infinite',
        }}
      />
      <div
        id="nebula-blob-2"
        className={`fixed top-1/2 -right-28 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none -z-10 transition-all duration-700 ${
          isGold
            ? 'bg-gradient-to-bl from-emerald-500/15 via-yellow-500/10 to-transparent'
            : 'bg-gradient-to-bl from-fuchsia-500/15 via-pink-600/10 to-transparent'
        }`}
      />

      {/* Smooth Cursor Aura & Core */}
      <div
        ref={auraRef}
        id="cosmic-cursor-aura"
        className="fixed w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-10 opacity-0 transition-opacity duration-300"
        style={{
          background: isGold
            ? 'radial-gradient(circle, rgba(251, 191, 36, 0.28) 0%, rgba(16, 185, 129, 0.18) 45%, transparent 80%)'
            : 'radial-gradient(circle, rgba(6, 182, 212, 0.28) 0%, rgba(217, 70, 239, 0.18) 45%, transparent 80%)',
        }}
      />
      <div
        ref={coreRef}
        id="cosmic-cursor-core"
        className="fixed w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-20 opacity-0 transition-opacity duration-200"
        style={{
          backgroundColor: isGold ? '#fbbf24' : '#38bdf8',
          boxShadow: isGold
            ? '0 0 14px #fbbf24, 0 0 25px #10b981'
            : '0 0 14px #38bdf8, 0 0 25px #d946ef',
        }}
      />

      {/* Micro Stardust Motes */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {motes.map((mote) => (
          <div
            key={mote.id}
            className="cursor-stardust"
            style={{
              left: `${mote.x}px`,
              top: `${mote.y}px`,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              backgroundColor: mote.color,
              boxShadow: `0 0 8px ${mote.color}`,
            }}
          />
        ))}
      </div>

      {/* Synthesizer Action Toast HUD */}
      {activeToast && (
        <div
          id="sfx-toast"
          className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 opacity-100"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-950/60 max-w-sm">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                activeToast.isGold
                  ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-400'
                  : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-400'
              }`}
            >
              {activeToast.icon === 'sun' ? (
                <Sun className="w-5 h-5 animate-spin" />
              ) : activeToast.icon === 'trophy' ? (
                <Trophy className="w-5 h-5" />
              ) : activeToast.icon === 'sparkles' ? (
                <Sparkles className="w-5 h-5" />
              ) : activeToast.icon === 'keyboard' ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <Music className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-mono font-bold truncate ${
                    activeToast.isGold ? 'text-yellow-400' : 'text-cyan-400'
                  }`}
                >
                  {activeToast.title}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-ping ${
                    activeToast.isGold ? 'bg-yellow-400' : 'bg-cyan-400'
                  }`}
                />
              </div>
              <div className="text-[11px] text-slate-300 truncate mt-0.5">
                {activeToast.desc}
              </div>
            </div>

            {/* Equalizer animation wave bars */}
            <div className="flex items-end gap-0.5 h-4 pl-1">
              <span className="w-1 bg-cyan-400 rounded-full audio-bar" style={{ height: '14px' }} />
              <span className="w-1 bg-fuchsia-400 rounded-full audio-bar" style={{ height: '18px' }} />
              <span className="w-1 bg-purple-400 rounded-full audio-bar" style={{ height: '10px' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
