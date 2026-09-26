import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
  HelpCircle,
  Clock,
  Layers,
  Shield,
  Zap,
  TrendingUp,
  Brain,
  GraduationCap,
  Users,
  Compass,
  CheckCircle2,
  ChevronRight,
  Crown,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigatePricing: () => void;
  onQuickTry: (topic: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onNavigatePricing,
  onQuickTry,
}) => {
  const [interactiveTopic, setInteractiveTopic] = useState("Newton's Laws of Motion & Rocket Physics");

  return (
    <div className="w-full space-y-28 pb-20 overflow-hidden">
      {/* 1. HERO SECTION WITH FLOATING UI MOCKUP */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span>ShikshaPlan AI • AI Curriculum & Classroom Mastery Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Curriculum Built at the Speed of{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Thought.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Transform any subject, grade level, and duration into a rich 3-in-1 instructional package: <strong>Structured Lesson Plans</strong>, <strong>Printable Student Worksheets</strong>, and <strong>Auto-Graded Quizzes with Answer Keys</strong>.
            </p>

            {/* Quick Interactive Prompt Test */}
            <div className="pt-2 max-w-md mx-auto lg:mx-0">
              <div className="p-1.5 rounded-2xl glass-panel border border-indigo-500/30 shadow-[0_15px_30px_rgba(99,102,241,0.25)] flex items-center gap-2">
                <input
                  type="text"
                  value={interactiveTopic}
                  onChange={(e) => setInteractiveTopic(e.target.value)}
                  placeholder="Enter a topic (e.g. Photosynthesis)..."
                  className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => onQuickTry(interactiveTopic)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sample topic tags */}
              <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 text-[11px] text-slate-400">
                <span className="shrink-0 text-slate-500">Popular:</span>
                <button
                  onClick={() => {
                    setInteractiveTopic('Cellular Respiration & ATP');
                    onQuickTry('Cellular Respiration & ATP');
                  }}
                  className="hover:text-cyan-300 transition-colors underline underline-offset-2 shrink-0 cursor-pointer"
                >
                  Cellular Respiration
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    setInteractiveTopic('The American Revolution & Stamp Act');
                    onQuickTry('The American Revolution & Stamp Act');
                  }}
                  className="hover:text-cyan-300 transition-colors underline underline-offset-2 shrink-0 cursor-pointer"
                >
                  American Revolution
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    setInteractiveTopic('Pythagorean Theorem in 3D');
                    onQuickTry('Pythagorean Theorem in 3D');
                  }}
                  className="hover:text-cyan-300 transition-colors underline underline-offset-2 shrink-0 cursor-pointer"
                >
                  Pythagoras in 3D
                </button>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3 Free Plans / Mo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Export to PDF & Markdown</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>

          {/* Right Floating Antigravity UI Mockup */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Ambient Cosmic Backlight */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

            {/* Main Levitating UI Mockup Card */}
            <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 shadow-[0_25px_60px_-15px_rgba(99,102,241,0.35)] border border-indigo-400/30 animate-float">
              {/* Header of Mockup */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">
                    EDUPlan_AI // orbital_mechanics.pkg
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
                  Ready to Teach
                </span>
              </div>

              {/* Mockup Body: 3-in-1 Preview */}
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <BookOpen className="w-3.5 h-3.5" /> 1. Lesson Plan (Grade 8 • 45m)
                    </span>
                    <span className="text-emerald-400 text-[10px]">CCSS & NGSS Aligned</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    "Students construct balloon-powered trajectory models to experimentally verify Newton's Third Law: Action and Reaction."
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-300">Hook (10m)</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-300">Lab Practice (20m)</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-300">Exit Ticket (5m)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span className="flex items-center gap-1.5 text-purple-300">
                      <FileText className="w-3.5 h-3.5" /> 2. Student Worksheet
                    </span>
                    <span className="text-slate-400 text-[10px]">Print-Ready PDF</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    "Part 1: Velocity Calculations • Part 2: Critical Thinking Balloon Thrust Challenge"
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <HelpCircle className="w-3.5 h-3.5" /> 3. 5-Question Concept Quiz
                    </span>
                    <span className="text-emerald-400 text-[10px]">Answer Key Included</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    "Q1: When a rocket expels exhaust gases downward, the reaction force is..."
                  </p>
                </div>
              </div>

              {/* Floating Satellite Card 1 */}
              <div className="absolute -bottom-6 -left-6 glass-panel rounded-2xl p-3 border border-indigo-400/40 shadow-xl flex items-center gap-2.5 animate-float-reverse hidden sm:flex">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">100% Teacher Autonomy</div>
                  <div className="text-[9px] text-slate-400">Customizable duration & standards</div>
                </div>
              </div>

              {/* Floating Satellite Card 2 */}
              <div className="absolute -top-6 -right-6 glass-panel rounded-2xl p-3 border border-purple-400/40 shadow-xl flex items-center gap-2.5 animate-float-slow hidden sm:flex">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-300">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Differentiated Paths</div>
                  <div className="text-[9px] text-slate-400">Scaffold, Honors, & ELL modules</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-widest inline-flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Curriculum Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Modern Educators
          </h2>
          <p className="text-sm text-slate-400">
            EDUPlan AI doesn't just output generic text. It generates an interconnected tripartite curriculum ecosystem designed to engage every mind in your room.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-indigo-400/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Pedagogical Timeline Pacing
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Step-by-step instructional timelines with precise minute breakdowns for Hook, Direct Instruction, Guided Collaborative Work, and Exit Ticket closures.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-purple-400/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Printable Student Worksheets
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Formatted student handouts complete with student name headers, scaffolded response lines, conceptual exercises, and real-world critical thinking challenges.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-cyan-400/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              5-Question Concept Quizzes
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Instant formative assessments with rigorous multiple-choice questions, interactive testing modes, and detailed teacher explanations explaining student misconceptions.
            </p>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED FUTURE SCOPE & VISION SECTION */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-cyan-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-purple-950/40 relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(34,211,238,0.2)]">
          {/* Radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center space-y-4 max-w-3xl mx-auto mb-14">
            <span className="px-4 py-1 rounded-full text-xs font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-widest inline-flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-300" />
              Future Scope & Pedagogical Vision
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Reinventing Education Beyond Administrative Gravity
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Teaching is one of society's most vital callings, yet educators lose up to <strong>15 hours every week</strong> buried in administrative lesson formatting, grading rubrics, and paperwork. EDUPlan AI exists to eliminate this friction.
            </p>
          </div>

          {/* 3 Vision Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Vision Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                1. Eradicating Administrative Burden
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By automating standard alignments, time breakdowns, and worksheet layouts, teachers regain mental bandwidth to focus on what matters most: direct human connection and inspiring curious minds.
              </p>
            </div>

            {/* Vision Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                2. Adaptive Personalized Learning Paths
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every classroom is diverse. Our AI tailors assignments across three distinct differentiation bands: providing scaffolded prompts for struggling learners and creative open challenges for advanced students.
              </p>
            </div>

            {/* Vision Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                3. Real-Time Student Analytics (Roadmap)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Coming in Phase 2: Live digital quiz response telemetry. Detect student misconceptions the exact moment they occur, enabling instant in-class pivot interventions and longitudinal progress reports.
              </p>
            </div>
          </div>

          {/* Vision Callout Banner */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-cyan-900/40 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-amber-300 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-200">
                "Our north star is a classroom where no teacher burns out, and no child gets left behind."
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-[0_0_15px_#22d3ee] shrink-0 cursor-pointer"
            >
              Start Creating Free →
            </button>
          </div>
        </div>
      </section>

      {/* 4. PRICING TEASER SECTION */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest inline-flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Simple Subscriptions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Free for Starters, Limitless for Pros
          </h2>
          <p className="text-sm text-slate-400">
            Generate 3 lesson plans every month at zero cost, or upgrade to Pro Educator for unlimited access.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onNavigatePricing}
            className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:brightness-110 transition-all shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Pricing & Compare Tiers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
