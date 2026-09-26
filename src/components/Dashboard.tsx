import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
  Wand2,
  AlertTriangle,
  Crown,
  ChevronRight,
  Info,
  Sliders,
  CheckCircle,
  FolderHeart,
  BrainCircuit,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GeneratedLessonPackage, SavedPlanItem } from '../types';
import { PulsingOrbLoading } from './PulsingOrbLoading';
import { LessonResultView } from './LessonResultView';
import { saveLessonPlanToFirestore } from '../lib/firebase';
import { StudentDiagnosticProbe } from './StudentDiagnosticProbe';

const GRADE_LEVELS = [
  'Kindergarten (K)',
  'Elementary (Grades 1-3)',
  'Upper Elementary (Grades 4-5)',
  'Middle School (Grades 6-8)',
  'High School (Grades 9-10)',
  'Upper High School (Grades 11-12)',
  'AP / Honors / IB Level',
  'Undergraduate / College Intro',
];

const DURATIONS = [
  '30 Minutes (Sprint)',
  '45 Minutes (Standard Period)',
  '60 Minutes (Hour Session)',
  '90 Minutes (Block Schedule)',
  '120 Minutes (Workshop / Double Block)',
];

const SUBJECTS = [
  'STEM & Physical Sciences',
  'Mathematics & Logic',
  'Humanities & English Literature',
  'Social Studies & World History',
  'Computer Science & Robotics',
  'Visual Arts & Music',
  'Biology & Life Sciences',
];

const POPULAR_TOPICS = [
  'Photosynthesis and Cellular Respiration',
  "Newton's Laws of Motion & Orbital Mechanics",
  'Civil Rights Movement & Primary Source Analysis',
  'Quadratic Equations & Real-World Parabolic Flight',
  'Shakespearean Dramatic Irony in Macbeth',
  'Plate Tectonics, Earthquakes, and Fault Lines',
];

interface DashboardProps {
  onNavigatePricing: () => void;
  onNavigateSaved: () => void;
  onOpenAuth: () => void;
  onTriggerPrint: (plan: GeneratedLessonPackage) => void;
  savedPlans: SavedPlanItem[];
  setSavedPlans: React.Dispatch<React.SetStateAction<SavedPlanItem[]>>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigatePricing,
  onNavigateSaved,
  onOpenAuth,
  onTriggerPrint,
  savedPlans,
  setSavedPlans,
}) => {
  const { currentUser, userProfile, recordGeneration, isDemoUser } = useAuth();

  // Input Form States
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[3]); // Middle school default
  const [duration, setDuration] = useState(DURATIONS[1]); // 45 mins default
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [pedagogicalFocus, setPedagogicalFocus] = useState('Inquiry-Based & Hands-On');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Adaptive Student Understanding Level States
  const [studentUnderstandingLevel, setStudentUnderstandingLevel] = useState<
    'beginner' | 'developing' | 'proficient' | 'advanced' | 'mixed'
  >('developing');
  const [diagnosticScore, setDiagnosticScore] = useState<number>(68);
  const [diagnosticInsights, setDiagnosticInsights] = useState<string>(
    'Tier 2 Guided Practice: Address common misconceptions and scaffold multi-step problem solving.'
  );
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  // Generation & Result States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedLessonPackage | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Quota enforcement
  const isPro = userProfile?.planTier === 'pro';
  const monthlyUsage = userProfile?.monthlyGenerationsCount ?? 0;
  const isQuotaExceeded = !isPro && monthlyUsage >= 3;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Please specify a lesson topic or concept.');
      return;
    }

    if (isQuotaExceeded) {
      setErrorMsg('Monthly limit reached on the Free Basic Tier. Upgrade to Pro for unlimited generation.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);
    setGeneratedResult(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          gradeLevel,
          duration,
          subject,
          additionalNotes: `${pedagogicalFocus}. ${additionalNotes}`.trim(),
          userTier: isPro ? 'pro' : 'basic',
          generationCount: monthlyUsage,
          studentUnderstandingLevel,
          diagnosticScore,
          diagnosticInsights,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lesson package.');
      }

      setGeneratedResult(data);
      // Update generation counter
      await recordGeneration();
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err.message || 'An error occurred while contacting the AI model.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!generatedResult) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    setIsSaving(true);
    try {
      const savedDoc = await saveLessonPlanToFirestore(currentUser.uid, {
        topic: generatedResult.topic,
        gradeLevel: generatedResult.gradeLevel,
        duration: generatedResult.duration,
        lessonPlanMarkdown: generatedResult.markdown.lessonPlanMd,
        worksheetMarkdown: generatedResult.markdown.worksheetMd,
        quizJson: JSON.stringify(generatedResult.quiz),
      });

      setSavedPlans((prev) => [savedDoc, ...prev]);
      setIsSaved(true);
    } catch (err) {
      console.error('Failed to save lesson plan:', err);
      // Local fallback save so educator doesn't lose work
      const fallbackItem: SavedPlanItem = {
        id: `plan_${Date.now()}`,
        userId: currentUser.uid,
        topic: generatedResult.topic,
        gradeLevel: generatedResult.gradeLevel,
        duration: generatedResult.duration,
        lessonPlanMarkdown: generatedResult.markdown.lessonPlanMd,
        worksheetMarkdown: generatedResult.markdown.worksheetMd,
        quizJson: JSON.stringify(generatedResult.quiz),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSavedPlans((prev) => [fallbackItem, ...prev]);
      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-8">
      {/* Educator Header & Status Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_20px_50px_-15px_rgba(99,102,241,0.2)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Antigravity Instructional Suite
              </span>
              {isPro ? (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> PRO Unlimited
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Basic Tier ({monthlyUsage}/3 used this month)
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Curriculum Architecture Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Input your core lesson parameters below. In seconds, EDUPlan AI generates a complete instructional lesson plan, a printable student worksheet, and a 5-question mastery quiz with an answer key.
            </p>
          </div>

          {/* Quick Actions / Quota Card */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!isPro ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-center justify-between sm:justify-start gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Monthly Free Quota
                  </div>
                  <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>{monthlyUsage} / 3 Plans</span>
                    {monthlyUsage >= 3 && (
                      <span className="text-[10px] text-rose-400 font-bold">(Limit Reached)</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onNavigatePricing}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center gap-1 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5" />
                  Upgrade Pro
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Unlimited Generations Active</span>
              </div>
            )}

            <button
              onClick={onNavigateSaved}
              className="px-4 py-3 rounded-2xl glass-panel text-xs font-semibold text-slate-200 hover:text-white hover:border-indigo-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FolderHeart className="w-4 h-4 text-pink-400" />
              <span>Saved Lessons ({savedPlans.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quota Exceeded Warning Banner */}
      {isQuotaExceeded && (
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-indigo-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                You have reached your 3 free lesson plans this month
              </h3>
              <p className="text-xs text-slate-300">
                Upgrade to the <strong>Pro Educator Plan ($9.99/mo)</strong> for unlimited lesson plans, instant worksheets, and advanced differentiated instruction.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigatePricing}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(251,191,36,0.5)] shrink-0 cursor-pointer"
          >
            Upgrade to Pro Now →
          </button>
        </div>
      )}

      {/* Loading State or Result or Primary Form */}
      {isGenerating ? (
        <PulsingOrbLoading topic={topic} gradeLevel={gradeLevel} duration={duration} />
      ) : generatedResult ? (
        <LessonResultView
          lessonData={generatedResult}
          onSaveToProfile={handleSaveToProfile}
          isSaving={isSaving}
          isSaved={isSaved}
          onReset={() => setGeneratedResult(null)}
          onTriggerPrint={() => onTriggerPrint(generatedResult)}
        />
      ) : (
        /* Primary Input Form */
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-500/20 shadow-[0_25px_60px_-15px_rgba(99,102,241,0.25)] relative overflow-hidden">
          {/* Subtle glowing halo */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-indigo-400" />
              Lesson Parameters & Focus
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Customize topic, grade level, and duration to guide the generative pedagogical model.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg('')}
                className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold cursor-pointer transition-all shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Primary Topic Input */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>1. Lesson Topic or Concept *</span>
                <span className="text-[11px] font-normal text-slate-400">Be as specific or creative as you like</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Newton's Three Laws of Motion with Balloon Rocket Lab"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                />
              </div>

              {/* Quick Topic Chips */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-slate-500">Inspire me:</span>
                {POPULAR_TOPICS.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(t)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-400 border border-white/5 transition-colors cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Level & Duration Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-violet-400" />
                  <span>2. Target Grade Level *</span>
                </label>
                <div className="relative">
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer appearance-none"
                  >
                    {GRADE_LEVELS.map((g) => (
                      <option key={g} value={g} className="bg-slate-950 text-white">
                        {g}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>3. Class Duration *</span>
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer appearance-none"
                  >
                    {DURATIONS.map((d) => (
                      <option key={d} value={d} className="bg-slate-950 text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Pedagogical Modifiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-pink-400" />
                  <span>Subject Category</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-400 transition-all cursor-pointer"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s} className="bg-slate-950 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Pedagogical Style</span>
                </label>
                <select
                  value={pedagogicalFocus}
                  onChange={(e) => setPedagogicalFocus(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-400 transition-all cursor-pointer"
                >
                  <option value="Inquiry-Based & Hands-On Lab">Inquiry-Based & Hands-On Lab</option>
                  <option value="Socratic Discussion & Debate">Socratic Discussion & Debate</option>
                  <option value="Direct Instruction & Step-by-Step Modeling">Direct Instruction & Step-by-Step Modeling</option>
                  <option value="Differentiated Stations & Flipped Classroom">Differentiated Stations & Flipped Classroom</option>
                  <option value="Standardized Exam Mastery & Scaffolding">Standardized Exam Mastery & Scaffolding</option>
                </select>
              </div>
            </div>

            {/* ADAPTIVE STUDENT UNDERSTANDING PRE-ASSESSMENT PROBE */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-cyan-500/30 shadow-[0_10px_30px_-10px_rgba(34,211,238,0.2)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] shrink-0">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>4. Student Understanding Level & Diagnostic Probe</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Adaptive AI
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      EDUPlan AI calibrates instructional scaffolding, worksheet problem depth, and quiz questions to this baseline.
                    </p>
                  </div>
                </div>

                {/* Button to run 3-question diagnostic quiz */}
                <button
                  type="button"
                  onClick={() => setShowDiagnosticModal(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-300 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Ask Diagnostic Questions First</span>
                </button>
              </div>

              {/* Quick Level Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {[
                  {
                    id: 'beginner',
                    label: 'Beginner / Novice',
                    sub: 'Tier 1 Scaffolding (0-40%)',
                    color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
                  },
                  {
                    id: 'developing',
                    label: 'Developing / Grade-Level',
                    sub: 'Guided Practice (41-70%)',
                    color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
                  },
                  {
                    id: 'proficient',
                    label: 'Proficient / Standard',
                    sub: 'Standard Rigor (71-85%)',
                    color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
                  },
                  {
                    id: 'advanced',
                    label: 'Advanced / Mastery',
                    sub: 'Acceleration (86-100%)',
                    color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
                  },
                  {
                    id: 'mixed',
                    label: 'Mixed Classroom',
                    sub: 'Tiered 3-Track Stations',
                    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
                  },
                ].map((tier) => {
                  const isCurrent = studentUnderstandingLevel === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => {
                        setStudentUnderstandingLevel(tier.id as any);
                        setDiagnosticInsights(`Educator-selected readiness tier: ${tier.label}`);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? `${tier.color} ring-1 ring-white/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]`
                          : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-400'
                      }`}
                    >
                      <span className={`text-[11px] font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                        {tier.label}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 block">
                        {tier.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Status / Active Insight Banner */}
              <div className="flex flex-wrap items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 gap-2">
                <span className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>
                    Current Plan Target: <strong className="text-white capitalize">{studentUnderstandingLevel}</strong> level
                    {diagnosticScore !== undefined && ` (${diagnosticScore}% baseline)`}
                    <span className="text-slate-400 hidden sm:inline ml-2">— {diagnosticInsights}</span>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowDiagnosticModal(true)}
                  className="text-cyan-400 hover:text-cyan-300 underline font-semibold text-[11px] cursor-pointer shrink-0"
                >
                  Diagnose via Questions →
                </button>
              </div>
            </div>

            {/* Educator Specific Requests */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Special Adaptations or Specific Classroom Context (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Include an engaging video starter hook, provide accommodations for 3 ELL students, and tie into state science standards."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isQuotaExceeded}
                className={`w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2.5 transition-all shadow-[0_0_30px_rgba(99,102,241,0.5)] cursor-pointer ${
                  isQuotaExceeded
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:brightness-110 active:scale-[0.99]'
                }`}
              >
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
                <span>Generate Adaptive Lesson Package (Plan + Worksheet + Quiz)</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interactive Student Diagnostic Probe Modal */}
      {showDiagnosticModal && (
        <StudentDiagnosticProbe
          topic={topic || 'Core Curriculum Concept'}
          gradeLevel={gradeLevel}
          subject={subject}
          initialLevel={studentUnderstandingLevel}
          onApplyDiagnosis={(diagnosis) => {
            setStudentUnderstandingLevel(diagnosis.level);
            setDiagnosticScore(diagnosis.score);
            setDiagnosticInsights(diagnosis.insights);
          }}
          onClose={() => setShowDiagnosticModal(false)}
        />
      )}
    </div>
  );
};
