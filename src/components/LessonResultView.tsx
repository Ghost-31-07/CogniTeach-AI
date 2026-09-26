import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Download,
  BookmarkCheck,
  Bookmark,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Sparkles,
  Users,
  Target,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  GraduationCap,
  BrainCircuit,
  AlertTriangle,
  Edit3,
} from 'lucide-react';
import { GeneratedLessonPackage } from '../types';

interface LessonResultViewProps {
  lessonData: GeneratedLessonPackage;
  onSaveToProfile: () => Promise<void>;
  isSaving: boolean;
  isSaved: boolean;
  onReset: () => void;
  onTriggerPrint: () => void;
}

export const LessonResultView: React.FC<LessonResultViewProps> = ({
  lessonData,
  onSaveToProfile,
  isSaving,
  isSaved,
  onReset,
  onTriggerPrint,
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'worksheet' | 'quiz'>('plan');
  const [copied, setCopied] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Interactive Worksheet States
  const [worksheetMode, setWorksheetMode] = useState<'student' | 'teacher'>('student');
  const [interactiveAnswers, setInteractiveAnswers] = useState<Record<number, string>>({});
  const [revealedExemplars, setRevealedExemplars] = useState<Record<number, boolean>>({});
  const [isDigitalTypingMode, setIsDigitalTypingMode] = useState(false);

  const handleCopy = () => {
    let textToCopy = '';
    if (activeTab === 'plan') {
      textToCopy = lessonData.markdown.lessonPlanMd;
    } else if (activeTab === 'worksheet') {
      textToCopy = lessonData.markdown.worksheetMd;
    } else {
      textToCopy = lessonData.markdown.quizMd;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectQuizOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    lessonData.quiz.questions.forEach((q) => {
      if (selectedQuizAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Floating Control Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border border-indigo-500/20 shadow-[0_10px_35px_-10px_rgba(99,102,241,0.25)]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
              {lessonData.gradeLevel}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {lessonData.duration}
            </span>
            {lessonData.understandingProfile && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 capitalize">
                <BrainCircuit className="w-3 h-3" /> {lessonData.understandingProfile.assessedLevel} Level
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {lessonData.topic}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onSaveToProfile}
            disabled={isSaving || isSaved}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isSaved
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>Saved to Profile</span>
              </>
            ) : isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save to Profile</span>
              </>
            )}
          </button>

          <button
            onClick={onTriggerPrint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center gap-1.5 transition-all hover:border-indigo-400 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Export to PDF</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Plan</span>
          </button>
        </div>
      </div>

      {/* Segmented Antigravity Tab Bar */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 max-w-xl mx-auto backdrop-blur-md">
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'plan'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Lesson Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('worksheet')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'worksheet'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Student Worksheet</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>3. 5-Question Quiz</span>
        </button>
      </div>

      {/* TAB 1: STRUCTURED LESSON PLAN */}
      {activeTab === 'plan' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Adaptive Understanding Profile Banner (If Present) */}
          {lessonData.understandingProfile && (
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/30 bg-gradient-to-r from-indigo-950/50 via-slate-900/60 to-cyan-950/40 relative overflow-hidden space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] shrink-0">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 block">
                      Adaptive Pedagogical Calibration
                    </span>
                    <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                      <span>
                        Tailored to: <span className="capitalize">{lessonData.understandingProfile.assessedLevel}</span> Understanding Level
                      </span>
                      {lessonData.understandingProfile.scorePercentage !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Baseline: {lessonData.understandingProfile.scorePercentage}%
                        </span>
                      )}
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {lessonData.understandingProfile.diagnosticSummary}
              </p>

              {/* Targeted Misconceptions */}
              {lessonData.understandingProfile.targetedMisconceptions &&
                lessonData.understandingProfile.targetedMisconceptions.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Targeted Misconceptions & Knowledge Hurdles Addressed:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {lessonData.understandingProfile.targetedMisconceptions.map((misc, mIdx) => (
                        <span
                          key={mIdx}
                          className="px-2.5 py-1 rounded-xl text-xs bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {misc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Strategy & Pacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-xs">
                  <span className="text-[10px] font-bold uppercase text-indigo-400 block mb-1">
                    Adapted Instructional Strategy
                  </span>
                  <p className="text-slate-300 text-[11px]">
                    {lessonData.understandingProfile.adaptedTeachingStrategy}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-xs">
                  <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-1">
                    Recommended Cohort Pacing
                  </span>
                  <p className="text-slate-300 text-[11px]">
                    {lessonData.understandingProfile.recommendedPacing}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Overview & Objectives Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Target className="w-4 h-4" /> Instructional Overview
              </span>
              <h3 className="text-2xl font-black text-white">
                {lessonData.lessonPlan.title}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {lessonData.lessonPlan.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              {/* Learning Objectives */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Learning Objectives (SWBAT)
                </h4>
                <ul className="space-y-2">
                  {lessonData.lessonPlan.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Materials & Standards */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Layers className="w-4 h-4" /> Materials Needed
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {lessonData.lessonPlan.materialsNeeded.map((mat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4" /> Standards Alignment
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {lessonData.lessonPlan.standardsAligned.map((std, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-300"
                      >
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Instructional Steps */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
            <h3 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Instructional Sequence & Time Pacing
            </h3>

            <div className="space-y-6">
              {lessonData.lessonPlan.timeline.map((step, idx) => (
                <div
                  key={idx}
                  className="relative pl-6 sm:pl-8 border-l-2 border-indigo-500/30 hover:border-indigo-400 transition-colors pb-4 last:pb-0"
                >
                  {/* Step Marker Orb */}
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300 shadow-[0_0_10px_#22d3ee]">
                    {idx + 1}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="text-base font-bold text-white">
                      {step.phase}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {step.durationMinutes} minutes
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                        Teacher Actions & Modeling
                      </span>
                      <p className="text-xs text-slate-200">
                        {step.teacherGuidance}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                        Student Engagement & Tasks
                      </span>
                      <p className="text-xs text-slate-200">
                        {step.studentActivity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Differentiation & Exit Ticket */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-5 border border-indigo-500/20">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Users className="w-4 h-4" /> Advanced Learners
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lessonData.lessonPlan.differentiation.advancedLearners}
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-indigo-500/20">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Users className="w-4 h-4" /> Scaffold / Support
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lessonData.lessonPlan.differentiation.supportLearners}
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-indigo-500/20">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Users className="w-4 h-4" /> ESL / ELL Strategies
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lessonData.lessonPlan.differentiation.eslSupport}
              </p>
            </div>
          </div>

          {/* Assessment & Exit Ticket Card */}
          <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/50 to-cyan-950/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                  Check for Understanding
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Formative Assessment: {lessonData.lessonPlan.assessment}
                </h4>
                <p className="text-xs text-slate-300 italic pt-1">
                  Exit Ticket Prompt: "{lessonData.lessonPlan.exitTicket}"
                </p>
              </div>
              <button
                onClick={() => setActiveTab('quiz')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-[0_0_15px_#22d3ee] shrink-0"
              >
                Review 5-Question Quiz →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRINTABLE WORKSHEET */}
      {activeTab === 'worksheet' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative">
            {/* Printable Watermark/Badge & Header Controls */}
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/10 mb-6 gap-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {worksheetMode === 'teacher' ? 'Teacher Edition & Solution Rubric' : 'Print-Ready Student Handout'}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {lessonData.worksheet.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 italic">
                  {lessonData.worksheet.instructions}
                </p>
              </div>

              {/* Mode Controls & Print Action */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Switch between Student Edition and Teacher Key */}
                <div className="flex p-1 bg-slate-950/80 rounded-xl border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setWorksheetMode('student')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      worksheetMode === 'student'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Student Edition
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorksheetMode('teacher')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      worksheetMode === 'teacher'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Teacher Solutions
                  </button>
                </div>

                {/* Digital Interactive typing toggle */}
                <button
                  type="button"
                  onClick={() => setIsDigitalTypingMode(!isDigitalTypingMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isDigitalTypingMode
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isDigitalTypingMode ? 'Type Mode: Active' : 'Type On-Screen'}</span>
                </button>

                <button
                  type="button"
                  onClick={onTriggerPrint}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Worksheet</span>
                </button>
              </div>
            </div>

            {/* Student Name/Date Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 mb-8">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-mono text-slate-500">________________________</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date</span>
                <span className="font-mono text-slate-500">______________</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Class Period</span>
                <span className="font-mono text-slate-500">_________</span>
              </div>
            </div>

            {/* Worksheet Sections */}
            <div className="space-y-8">
              {lessonData.worksheet.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-base font-bold text-indigo-300">
                      {section.heading}
                    </h4>
                    {section.subtext && (
                      <p className="text-xs text-slate-400 italic">
                        {section.subtext}
                      </p>
                    )}
                  </div>

                  <div className="space-y-6">
                    {section.items.map((item, qIdx) => {
                      const qNumber =
                        typeof item === 'object' && item?.questionNumber ? item.questionNumber : qIdx + 1;
                      const qPrompt =
                        typeof item === 'object'
                          ? item?.prompt || (item as any)?.question || (item as any)?.text || ''
                          : String(item);
                      const qType = typeof item === 'object' && item?.type ? item.type : 'open_ended';
                      const qChoices = typeof item === 'object' ? item.choices : undefined;
                      const qScaffoldLines = typeof item === 'object' && item.scaffoldLines ? item.scaffoldLines : 3;
                      const qSampleAnswer = typeof item === 'object' ? (item as any).sampleAnswer : undefined;

                      const isExemplarVisible = worksheetMode === 'teacher' || revealedExemplars[qNumber];

                      return (
                        <div key={qNumber} className="space-y-2.5">
                          {/* Question Prompt */}
                          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-white">
                            <span className="text-cyan-400 font-bold shrink-0">{qNumber}.</span>
                            <span>{qPrompt || `Question ${qNumber} on ${lessonData.topic}`}</span>
                          </div>

                          {qType === 'multiple_choice' && qChoices ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5 pt-1">
                              {qChoices.map((choice, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-xs text-slate-300 border border-white/5"
                                >
                                  <span className="w-4 h-4 rounded border border-slate-500 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    {['A', 'B', 'C', 'D'][cIdx]}
                                  </span>
                                  <span>{choice}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="pl-6 space-y-3 pt-1">
                              {/* Interactive On-Screen Typing Area (Optional) */}
                              {isDigitalTypingMode && (
                                <div className="space-y-1.5">
                                  <textarea
                                    rows={3}
                                    value={interactiveAnswers[qNumber] || ''}
                                    onChange={(e) =>
                                      setInteractiveAnswers((prev) => ({ ...prev, [qNumber]: e.target.value }))
                                    }
                                    placeholder="Type student response directly on screen..."
                                    className="w-full bg-slate-950/80 border border-indigo-500/30 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                                  />
                                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span>Interactive Digital Answer</span>
                                    <span>
                                      {(interactiveAnswers[qNumber] || '').trim().split(/\s+/).filter(Boolean).length} words
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Lined Handwriting Space for Printout */}
                              <div className="space-y-1">
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                                  <span>Handwriting Space (Printout Mode)</span>
                                  {qSampleAnswer && worksheetMode !== 'teacher' && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setRevealedExemplars((prev) => ({
                                          ...prev,
                                          [qNumber]: !prev[qNumber],
                                        }))
                                      }
                                      className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer lowercase text-[10px]"
                                    >
                                      {revealedExemplars[qNumber] ? 'hide solution' : 'show solution'}
                                    </button>
                                  )}
                                </div>
                                {Array(qScaffoldLines)
                                  .fill(0)
                                  .map((_, lineIdx) => (
                                    <div
                                      key={lineIdx}
                                      className="w-full border-b border-dashed border-slate-700/80 h-6"
                                    />
                                  ))}
                              </div>

                              {/* Teacher Exemplar Solution Box */}
                              {isExemplarVisible && qSampleAnswer && (
                                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 animate-in fade-in space-y-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Exemplar Solution & Rubric
                                  </span>
                                  <p className="text-emerald-100 text-[11px] leading-relaxed">
                                    {qSampleAnswer}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Critical Thinking Challenge */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 space-y-3">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Deep Thinker Extension Challenge
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {lessonData.worksheet.criticalThinkingChallenge}
                </p>

                {isDigitalTypingMode && (
                  <textarea
                    rows={3}
                    value={interactiveAnswers[999] || ''}
                    onChange={(e) => setInteractiveAnswers((prev) => ({ ...prev, [999]: e.target.value }))}
                    placeholder="Type challenge reflection here on screen..."
                    className="w-full bg-slate-950/80 border border-purple-500/30 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-all"
                  />
                )}

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-purple-400/80 tracking-wider block">
                    Handwriting Response Area (for printout)
                  </span>
                  <div className="w-full border-b border-dashed border-purple-500/40 h-6" />
                  <div className="w-full border-b border-dashed border-purple-500/40 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 5-QUESTION QUIZ WITH ANSWER KEY */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Formative Assessment
                </span>
                <h3 className="text-2xl font-black text-white">
                  {lessonData.quiz.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lessonData.quiz.description}
                </p>
              </div>

              {/* Quiz submission / score status */}
              {quizSubmitted ? (
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold text-white">
                    Score:{' '}
                    <span className="text-emerald-400 text-sm">
                      {calculateScore()} / {lessonData.quiz.questions.length}
                    </span>{' '}
                    ({Math.round((calculateScore() / lessonData.quiz.questions.length) * 100)}%)
                  </div>
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedQuizAnswers({});
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 border border-white/10"
                  >
                    Retake Quiz
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(selectedQuizAnswers).length === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                >
                  Grade My Answers
                </button>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {lessonData.quiz.questions.map((q, idx) => {
                const userChoice = selectedQuizAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 transition-colors hover:border-indigo-500/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white">
                        <span className="text-indigo-400 mr-1.5">Question {q.id}:</span>
                        {q.question}
                      </h4>
                      {quizSubmitted && (
                        <div>
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                              <XCircle className="w-3.5 h-3.5" /> Review
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 4 Choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userChoice === oIdx;
                        const isThisCorrect = q.correctAnswerIndex === oIdx;

                        let styleClasses =
                          'bg-slate-900/60 border-white/5 text-slate-300 hover:border-indigo-500/40 hover:bg-white/5';
                        if (quizSubmitted) {
                          if (isThisCorrect) {
                            styleClasses = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200';
                          } else if (isSelected && !isThisCorrect) {
                            styleClasses = 'bg-rose-950/40 border-rose-500/50 text-rose-200';
                          }
                        } else if (isSelected) {
                          styleClasses = 'bg-indigo-600/30 border-indigo-500 text-white font-semibold';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectQuizOption(q.id, oIdx)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${styleClasses}`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'
                              }`}
                            >
                              {['A', 'B', 'C', 'D'][oIdx]}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation toggle / reveal */}
                    {(quizSubmitted || showAnswerKey) && (
                      <div className="mt-2 p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200">
                        <strong className="text-cyan-300">Teacher Rationale:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answer Key Reveal Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                {showAnswerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-cyan-400" />}
                <span>{showAnswerKey ? 'Hide Full Answer Key' : 'Reveal Complete Answer Key & Explanations'}</span>
              </button>

              <button
                onClick={onTriggerPrint}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
