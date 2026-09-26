import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  Layers,
  ArrowRight,
  RefreshCw,
  X,
  Target,
  Users,
  Lightbulb,
  Check
} from 'lucide-react';
import { DiagnosticQuestion } from '../types';

interface StudentDiagnosticProbeProps {
  topic: string;
  gradeLevel: string;
  subject: string;
  onApplyDiagnosis: (diagnosis: {
    level: 'beginner' | 'developing' | 'proficient' | 'advanced' | 'mixed';
    score: number;
    insights: string;
  }) => void;
  onClose: () => void;
  initialLevel?: 'beginner' | 'developing' | 'proficient' | 'advanced' | 'mixed';
}

const LEVEL_PRESETS: {
  level: 'beginner' | 'developing' | 'proficient' | 'advanced' | 'mixed';
  title: string;
  badge: string;
  score: number;
  description: string;
  color: string;
  border: string;
  bg: string;
  tag: string;
}[] = [
  {
    level: 'beginner',
    title: 'Foundational / Novice',
    badge: 'Tier 1 Remediation',
    score: 30,
    description: 'Students struggle with core prerequisites and terminology. Needs high visual scaffolding, concrete metaphors, and step-by-step guidance.',
    color: 'text-amber-400',
    border: 'border-amber-500/30 hover:border-amber-400',
    bg: 'bg-amber-500/10',
    tag: '0 - 40% Baseline',
  },
  {
    level: 'developing',
    title: 'Developing / Grade-Level',
    badge: 'Tier 2 Guided Practice',
    score: 65,
    description: 'Students recall basic rules but struggle with multi-step application or common misconceptions. Needs guided modeling and scaffolded practice.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30 hover:border-cyan-400',
    bg: 'bg-cyan-500/10',
    tag: '41 - 70% Baseline',
  },
  {
    level: 'proficient',
    title: 'Proficient / Competent',
    badge: 'Standard Rigor',
    score: 85,
    description: 'Students have solid conceptual intuition and are ready for independent inquiry, real-world application, and peer debates.',
    color: 'text-indigo-400',
    border: 'border-indigo-500/30 hover:border-indigo-400',
    bg: 'bg-indigo-500/10',
    tag: '71 - 85% Baseline',
  },
  {
    level: 'advanced',
    title: 'Advanced / Mastery',
    badge: 'Tier 3 Acceleration',
    score: 95,
    description: 'Students grasp principles almost instantly. Needs non-routine problem solving, higher-order synthesis (DOK 3-4), and creative design tasks.',
    color: 'text-purple-400',
    border: 'border-purple-500/30 hover:border-purple-400',
    bg: 'bg-purple-500/10',
    tag: '86 - 100% Baseline',
  },
  {
    level: 'mixed',
    title: 'Mixed / Diverse Classroom',
    badge: 'Multi-Track Stations',
    score: 60,
    description: 'Broad spread of student readiness across the room. Needs 3-tiered rotational stations (Foundational, Core, Extension) with tiered exit slips.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30 hover:border-emerald-400',
    bg: 'bg-emerald-500/10',
    tag: 'Heterogeneous Cohort',
  },
];

export const StudentDiagnosticProbe: React.FC<StudentDiagnosticProbeProps> = ({
  topic,
  gradeLevel,
  subject,
  onApplyDiagnosis,
  onClose,
  initialLevel = 'developing',
}) => {
  const [activeMode, setActiveMode] = useState<'probe' | 'preset'>('probe');
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'beginner' | 'developing' | 'proficient' | 'advanced' | 'mixed'>(
    initialLevel || 'developing'
  );

  useEffect(() => {
    fetchDiagnosticQuestions();
  }, [topic, gradeLevel]);

  const fetchDiagnosticQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-diagnostic-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || 'Core Curriculum Concept',
          gradeLevel,
          subject,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate diagnostic questions');
      }

      const data = await res.json();
      if (data.diagnosticQuestions && data.diagnosticQuestions.length > 0) {
        setQuestions(data.diagnosticQuestions);
      }
    } catch (err) {
      console.warn('Using client fallback for diagnostic questions:', err);
      // Fast high-quality fallback questions for instant responsiveness
      setQuestions([
        {
          id: 1,
          question: `Which statement represents the core foundational principle of "${topic}"?`,
          conceptTested: 'Baseline Definition & Primary Phenomenon',
          bloomLevel: 'Foundational / Recall',
          options: [
            `A) Systematic cause-and-effect governed by predictable rules and component interactions.`,
            `B) Random occurrences with no reproducible scientific or logical structure.`,
            `C) Theoretical abstractions that do not apply to real-world physical systems.`,
            `D) An isolated concept that operates independently of all surrounding factors.`
          ],
          correctAnswerIndex: 0,
          explanation: `Systematic cause-and-effect is the bedrock foundation of ${topic}.`,
          misconceptions: [
            'Solid foundational intuition',
            'Confuses systematic behavior with random variance',
            'Assumes concept lacks authentic real-world utility',
            'Overlooks environmental or variable interactions'
          ]
        } as any,
        {
          id: 2,
          question: `When investigating a problem scenario in "${topic}", what is the primary diagnostic step?`,
          conceptTested: 'Mechanism & Cause-and-Effect Relationship',
          bloomLevel: 'Developing / Conceptual',
          options: [
            `A) Isolate the independent variables and observe how system outputs respond.`,
            `B) Change all parameters simultaneously without tracking baseline data.`,
            `C) Assume the initial guess is correct and reject any counter-evidence.`,
            `D) Memorize a single formula without understanding what each symbol represents.`
          ],
          correctAnswerIndex: 0,
          explanation: `Isolating key variables and observing response patterns is critical for understanding mechanisms.`,
          misconceptions: [
            'Competent inquiry and variable analysis',
            'Lacks controlled experimental discipline',
            'Confirmation bias / lacks analytical self-correction',
            'Relies purely on surface formula memorization'
          ]
        } as any,
        {
          id: 3,
          question: `How would a proficient student verify an edge-case outcome involving "${topic}"?`,
          conceptTested: 'Analytical Synthesis & Misconception Diagnosis',
          bloomLevel: 'Proficient / Analytical',
          options: [
            `A) Test against mathematical boundary conditions and compare with empirical benchmarks.`,
            `B) Disregard the edge case because it differs from the simplest textbook example.`,
            `C) Alter the original problem constraints to match an easier known answer.`,
            `D) Guess an approximate number without checking dimensional consistency.`
          ],
          correctAnswerIndex: 0,
          explanation: `Testing boundary conditions and verifying against empirical benchmarks demonstrates genuine analytical mastery.`,
          misconceptions: [
            'Demonstrates deep synthesis and problem-solving readiness',
            'Avoids cognitive struggle with non-routine scenarios',
            'Changes criteria rather than solving the actual problem',
            'Neglects mathematical and dimensional rigor'
          ]
        } as any
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  // Calculate score and diagnose understanding level
  const answeredCount = Object.keys(selectedAnswers).length;
  let correctCount = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctAnswerIndex) {
      correctCount++;
    }
  });

  const calculatedScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 65;

  let diagnosedLevel: 'beginner' | 'developing' | 'proficient' | 'advanced' | 'mixed' = 'developing';
  if (calculatedScore <= 40) {
    diagnosedLevel = 'beginner';
  } else if (calculatedScore <= 70) {
    diagnosedLevel = 'developing';
  } else if (calculatedScore <= 90) {
    diagnosedLevel = 'proficient';
  } else {
    diagnosedLevel = 'advanced';
  }

  const handleApplyProbeResult = () => {
    const levelInfo = LEVEL_PRESETS.find((p) => p.level === diagnosedLevel);
    onApplyDiagnosis({
      level: diagnosedLevel,
      score: calculatedScore,
      insights: `Diagnosed from student pre-quiz (${correctCount}/${questions.length} correct, ${calculatedScore}%). Targeted needs: ${levelInfo?.description}`,
    });
    onClose();
  };

  const handleApplyPreset = (presetLevel: 'beginner' | 'developing' | 'proficient' | 'advanced' | 'mixed') => {
    const preset = LEVEL_PRESETS.find((p) => p.level === presetLevel);
    onApplyDiagnosis({
      level: presetLevel,
      score: preset?.score || 70,
      insights: `Educator-specified classroom readiness tier: ${preset?.title}. ${preset?.description}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900/95 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(99,102,241,0.25)] text-left space-y-6">
        {/* Glowing Header Accent */}
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5" /> Adaptive Diagnostic Probe
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {gradeLevel}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Assess Student Understanding Level
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Topic: <strong className="text-indigo-300">{topic || 'Your Selected Topic'}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher: Take Probe vs Quick Preset */}
        <div className="flex p-1 bg-slate-950/80 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveMode('probe')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'probe'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Interactive Diagnostic Quiz ({questions.length} Questions)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('preset')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'preset'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Select Classroom Readiness Tier</span>
          </button>
        </div>

        {/* MODE 1: Interactive Diagnostic Probe */}
        {activeMode === 'probe' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">
                  Answer the diagnostic questions below as a student (or sample cohort):
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  EDUPlan AI will analyze concept gaps and calibrate the lesson pacing, worksheet difficulty, and quiz questions.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchDiagnosticQuestions}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-indigo-300 border border-indigo-500/30 flex items-center gap-1 transition-all shrink-0 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Regenerate Questions</span>
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                <p className="text-xs text-slate-400 animate-pulse">
                  Generating diagnostic misconceptions probe for "{topic}"...
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
                {questions.map((q, idx) => {
                  const selectedOpt = selectedAnswers[q.id];
                  const isAnswered = selectedOpt !== undefined;
                  const isCorrect = selectedOpt === q.correctAnswerIndex;

                  return (
                    <div
                      key={q.id || idx}
                      className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                          Question {idx + 1} • {q.conceptTested || 'Diagnostic Check'}
                        </span>
                        {isAnswered && (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                              isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {isCorrect ? 'Correct Grasp' : 'Misconception Found'}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-white leading-relaxed">
                        {q.question}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isThisSelected = selectedOpt === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, oIdx)}
                              className={`w-full p-3 rounded-xl text-xs text-left transition-all flex items-start gap-2.5 cursor-pointer border ${
                                isThisSelected
                                  ? oIdx === q.correctAnswerIndex
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                                    : 'bg-amber-500/20 border-amber-500 text-amber-200'
                                  : 'bg-white/5 border-white/5 hover:border-indigo-400/40 text-slate-300'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                  isThisSelected
                                    ? oIdx === q.correctAnswerIndex
                                      ? 'bg-emerald-500 text-slate-950'
                                      : 'bg-amber-500 text-slate-950'
                                    : 'bg-white/10 text-slate-400'
                                }`}
                              >
                                {['A', 'B', 'C', 'D'][oIdx]}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Diagnostic Feedback */}
                      {isAnswered && (
                        <div className="mt-2 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs space-y-1">
                          <p className="text-slate-300">
                            <strong className="text-indigo-300">Diagnostic Insight: </strong>
                            {q.explanation}
                          </p>
                          {q.misconceptions && q.misconceptions[selectedOpt] && (
                            <p className="text-[11px] text-slate-400 italic">
                              What this reveals: "{q.misconceptions[selectedOpt]}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Diagnostic Results Summary Bar */}
            {answeredCount > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-cyan-400">
                      Calculated Diagnostic Score: {calculatedScore}%
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {diagnosedLevel.toUpperCase()} LEVEL
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {diagnosedLevel === 'beginner' && 'Needs Foundational Remediation & Concrete Scaffolding'}
                    {diagnosedLevel === 'developing' && 'Approaching Grade Level: Guided Practice & Misconception Fixes'}
                    {diagnosedLevel === 'proficient' && 'Proficient: Ready for Inquiry & Real-World Application'}
                    {diagnosedLevel === 'advanced' && 'Advanced: Ready for Acceleration & Open-Ended Design'}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={handleApplyProbeResult}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Apply & Tailor Lesson Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Preset Classroom Readiness Tiers */}
        {activeMode === 'preset' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Select the tier that best matches your classroom's current comprehension level for <strong>{topic}</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {LEVEL_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.level;

                return (
                  <div
                    key={preset.level}
                    onClick={() => setSelectedPreset(preset.level)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `${preset.bg} ${preset.border} shadow-[0_0_20px_rgba(99,102,241,0.2)] ring-1 ring-white/20`
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-xs font-bold ${preset.color} flex items-center gap-1`}>
                          {preset.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 font-mono text-slate-300">
                          {preset.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                        {preset.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {preset.badge}
                      </span>
                      {isSelected ? (
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Selected
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Click to choose</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => handleApplyPreset(selectedPreset)}
                className="px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Apply "{LEVEL_PRESETS.find((p) => p.level === selectedPreset)?.title}" Tier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
