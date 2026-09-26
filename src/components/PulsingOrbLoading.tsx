import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, Cpu, Wand2 } from 'lucide-react';

interface PulsingOrbLoadingProps {
  topic: string;
  gradeLevel: string;
  duration: string;
}

const PHASES = [
  'Synthesizing pedagogical objectives & CCSS/NGSS alignments...',
  'Architecting active learning timeline & teacher modeling sequence...',
  'Scaffolding printable student worksheet & critical thinking exercises...',
  'Compiling 5-question concept mastery check & full answer rubric...',
  'Applying antigravity formatting & differentiation polish...',
];

const QUOTES = [
  '"Education is not the learning of facts, but the training of the mind to think." — Albert Einstein',
  '"The art of teaching is the art of assisting discovery." — Mark Van Doren',
  '"Tell me and I forget. Teach me and I remember. Involve me and I learn." — Benjamin Franklin',
];

export const PulsingOrbLoading: React.FC<PulsingOrbLoadingProps> = ({
  topic,
  gradeLevel,
  duration,
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 2800);

    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5500);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-16 px-6 glass-panel rounded-3xl border border-indigo-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(99,102,241,0.3)]">
      {/* Background glow radiating outward */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

      {/* Floating Antigravity Orb System */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        {/* Deep ambient glow layer */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 blur-2xl opacity-60 animate-pulse" />

        {/* Outer Orbiting Ring 1 */}
        <div
          className="absolute w-44 h-44 rounded-full border border-indigo-400/30 border-dashed animate-spin"
          style={{ animationDuration: '18s' }}
        />

        {/* Outer Orbiting Ring 2 (Counter-rotation) */}
        <div
          className="absolute w-36 h-36 rounded-full border border-cyan-400/40 border-t-transparent border-b-transparent animate-spin"
          style={{ animationDuration: '10s', animationDirection: 'reverse' }}
        />

        {/* Orbiting Satellite Dot 1 */}
        <div className="absolute w-full h-full animate-orbit pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
        </div>

        {/* Orbiting Satellite Dot 2 */}
        <div className="absolute w-full h-full animate-orbit-reverse pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />
        </div>

        {/* Pulsing Core Orb */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 p-[2px] shadow-[0_0_35px_rgba(99,102,241,0.8)] animate-float">
          <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-cyan-500/20 to-purple-500/20 animate-pulse" />
            <Brain className="w-8 h-8 text-cyan-300 animate-bounce relative z-10" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 absolute top-3 right-4 animate-ping" />
          </div>
        </div>
      </div>

      {/* Target Details Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-4">
        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
        <span>
          Designing for <strong>{topic}</strong> ({gradeLevel} • {duration})
        </span>
      </div>

      {/* Dynamic Status Progress Message */}
      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight min-h-[3.5rem] flex items-center justify-center transition-all duration-500">
        <Wand2 className="w-4 h-4 text-cyan-400 mr-2 shrink-0 animate-spin" />
        <span>{PHASES[phaseIndex]}</span>
      </h3>

      {/* Progress Bars Indicators */}
      <div className="flex gap-1.5 my-4">
        {PHASES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === phaseIndex
                ? 'w-8 bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                : i < phaseIndex
                ? 'w-4 bg-indigo-500'
                : 'w-2 bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-xs text-slate-400 italic max-w-md mt-2 transition-opacity duration-700">
        {QUOTES[quoteIndex]}
      </p>
    </div>
  );
};
