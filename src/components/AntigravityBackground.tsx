import React from 'react';

interface AntigravityBackgroundProps {
  isDark: boolean;
}

export const AntigravityBackground: React.FC<AntigravityBackgroundProps> = ({ isDark }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 antigravity-bg" aria-hidden="true">
      {/* Dynamic Nebulae Orbs */}
      <div
        className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-40 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-900'
            : 'bg-gradient-to-br from-indigo-200 via-blue-200 to-purple-200'
        }`}
        style={{ animation: 'float-slow 14s ease-in-out infinite' }}
      />
      <div
        className={`absolute top-1/3 -right-20 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-35 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-tr from-cyan-900 via-blue-900 to-indigo-950'
            : 'bg-gradient-to-tr from-cyan-100 via-sky-200 to-indigo-100'
        }`}
        style={{ animation: 'float-reverse 18s ease-in-out infinite' }}
      />
      <div
        className={`absolute -bottom-32 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-30 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-r from-violet-900 via-fuchsia-900 to-purple-950'
            : 'bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-100'
        }`}
        style={{ animation: 'float 12s ease-in-out infinite' }}
      />

      {/* Floating Micro-Particles */}
      <div className="absolute inset-0">
        {[
          { top: '15%', left: '20%', size: 'w-2 h-2', anim: 'animate-float', delay: '0s', opacity: 'opacity-40' },
          { top: '25%', left: '80%', size: 'w-3 h-3', anim: 'animate-float-reverse', delay: '1s', opacity: 'opacity-50' },
          { top: '65%', left: '15%', size: 'w-2.5 h-2.5', anim: 'animate-float-slow', delay: '2s', opacity: 'opacity-30' },
          { top: '75%', left: '70%', size: 'w-2 h-2', anim: 'animate-float', delay: '3s', opacity: 'opacity-45' },
          { top: '45%', left: '50%', size: 'w-1.5 h-1.5', anim: 'animate-float-reverse', delay: '1.5s', opacity: 'opacity-60' },
          { top: '85%', left: '35%', size: 'w-3 h-3', anim: 'animate-float-slow', delay: '2.5s', opacity: 'opacity-35' },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${p.size} ${p.anim} ${p.opacity} ${
              isDark ? 'bg-indigo-300 shadow-[0_0_12px_rgba(165,180,252,0.8)]' : 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
            }`}
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Subtle Zero-Gravity Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:32px_32px]"
      />
    </div>
  );
};
