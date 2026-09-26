import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentProgressRecord, ACADEMIC_SUBJECTS } from '../types';
import { fetchStudentProgressFromFirestore } from '../lib/firebase';
import {
  Users,
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Search,
  Filter,
  BarChart3,
  BookOpen,
  Award,
  ChevronRight,
  X,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

export const TeacherAnalyticsView: React.FC = () => {
  const { currentUser, isDemoUser } = useAuth();

  const [records, setRecords] = useState<StudentProgressRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active deep dive record
  const [activeDrillDown, setActiveDrillDown] = useState<StudentProgressRecord | null>(null);

  // Seeded demo progress records across multiple subjects for immediate rich data
  const defaultDemoRecords: StudentProgressRecord[] = [
    {
      id: 'prog_1',
      studentId: 'student_priyanshu',
      studentName: 'Priyanshu Patel',
      studentEmail: 'priyanshu.patel@school.edu',
      subject: 'Physics',
      topic: 'Kinematics & Projectile Motion',
      score: 3,
      totalQuestions: 5,
      percentage: 60,
      understandingLevel: 'developing',
      pointsEarned: 175,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      answers: [
        {
          questionId: 1,
          questionText: 'What is the vertical velocity of a projectile at the peak of its trajectory?',
          studentAnswer: '0 m/s',
          correctAnswer: '0 m/s',
          isCorrect: true,
          conceptTested: 'Vertical Velocity Inversion',
          mistakeType: 'None (Solid Foundational Insight)',
          mistakeExplanation: 'The student correctly identified that gravity decelerates vertical motion to zero before reversing direction.',
          remediationTip: 'Reinforce this concept by connecting vertical acceleration (-9.8 m/s²) which remains constant throughout.',
        },
        {
          questionId: 2,
          questionText: 'How does doubling the launch speed affect the maximum horizontal range (assuming constant 45° angle)?',
          studentAnswer: 'The range doubles (2x)',
          correctAnswer: 'The range quadruples (4x)',
          isCorrect: false,
          conceptTested: 'Quadratic Proportionality in Range Formula',
          mistakeType: 'Misconception: Linear Proportionality Bias',
          mistakeExplanation: 'Priyanshu treated the range equation as linear (R ∝ v) rather than quadratic (R = v² sin(2θ) / g). This is the single most common kinematics trap.',
          remediationTip: 'Have Priyanshu calculate the range using v=10 m/s vs v=20 m/s side-by-side to visualize why squaring v produces a 4x multiplier.',
        },
        {
          questionId: 3,
          questionText: 'Which variable is shared identically between horizontal and vertical components of motion?',
          studentAnswer: 'Time in flight (t)',
          correctAnswer: 'Time in flight (t)',
          isCorrect: true,
          conceptTested: 'Component Independence & Temporal Link',
          mistakeType: 'None (Accurate Understanding)',
          mistakeExplanation: 'Accurately grasped that time is the invariant bridge between both kinematic dimensions.',
          remediationTip: 'Encourage student to lead a paired whiteboard explanation with peers.',
        },
        {
          questionId: 4,
          questionText: 'If air resistance is neglected, what happens to the horizontal velocity during flight?',
          studentAnswer: 'It slows down gradually due to gravity',
          correctAnswer: 'It remains constant',
          isCorrect: false,
          conceptTested: 'Orthogonal Vector Independence',
          mistakeType: 'Misconception: Gravity Vector Contamination',
          mistakeExplanation: 'Priyanshu wrongly assumed gravity exerts a force in the horizontal direction. Confused downward gravitational pull with universal slowing.',
          remediationTip: 'Draw a free-body diagram showing only downward F_g vector and highlight zero horizontal force (F_x = 0 → a_x = 0).',
        },
        {
          questionId: 5,
          questionText: 'At what angle above the horizontal is maximum range achieved in ideal conditions?',
          studentAnswer: '45 degrees',
          correctAnswer: '45 degrees',
          isCorrect: true,
          conceptTested: 'Trigonometric Optimization',
          mistakeType: 'None (Accurate Intuition)',
          mistakeExplanation: 'Recognized that sin(2 * 45°) = sin(90°) = 1 reaches maximum possible trigonometric value.',
          remediationTip: 'Extend to inquire what happens on an inclined slope or with initial launch elevation.',
        },
      ],
    },
    {
      id: 'prog_2',
      studentId: 'student_ananya',
      studentName: 'Ananya Iyer',
      studentEmail: 'ananya.iyer@school.edu',
      subject: 'Mathematics',
      topic: 'Calculus: Derivatives & Optimization',
      score: 5,
      totalQuestions: 5,
      percentage: 100,
      understandingLevel: 'advanced',
      pointsEarned: 225,
      createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
      answers: [
        {
          questionId: 1,
          questionText: 'To find the local extrema of f(x), what is the first necessary condition on f’(x)?',
          studentAnswer: 'f’(x) = 0 or is undefined',
          correctAnswer: 'f’(x) = 0 or is undefined',
          isCorrect: true,
          conceptTested: 'Critical Points Definition',
          mistakeType: 'None (Flawless Execution)',
          mistakeExplanation: 'Recognized both stationary points (f’=0) and non-differentiable cusp points as valid critical values.',
          remediationTip: 'Present non-smooth absolute value functions or multi-variable contour optimization challenges.',
        },
        {
          questionId: 2,
          questionText: 'If f’(c) = 0 and f’’(c) < 0, what can be concluded about x = c?',
          studentAnswer: 'Local maximum',
          correctAnswer: 'Local maximum',
          isCorrect: true,
          conceptTested: 'Second Derivative Test',
          mistakeType: 'None',
          mistakeExplanation: 'Understands concavity: f’’ < 0 indicates concave down like a frown, guaranteeing a peak.',
          remediationTip: 'Pace forward to Lagrange multipliers or optimization with inequality constraints.',
        },
      ],
    },
    {
      id: 'prog_3',
      studentId: 'student_rohan',
      studentName: 'Rohan Verma',
      studentEmail: 'rohan.verma@school.edu',
      subject: 'Computer Science & AI',
      topic: 'Data Structures: Hash Tables & Collisions',
      score: 2,
      totalQuestions: 4,
      percentage: 50,
      understandingLevel: 'developing',
      pointsEarned: 150,
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      answers: [
        {
          questionId: 1,
          questionText: 'What is the average time complexity for searching an element in a well-distributed hash table?',
          studentAnswer: 'O(1) constant time',
          correctAnswer: 'O(1) constant time',
          isCorrect: true,
          conceptTested: 'Hash Table Lookup Efficiency',
          mistakeType: 'None (Solid Recall)',
          mistakeExplanation: 'Correctly identified constant-time direct indexing via hash function modulo table size.',
          remediationTip: 'Explore how load factor alpha impacts performance as buckets fill.',
        },
        {
          questionId: 2,
          questionText: 'What occurs in the worst-case scenario when all keys hash to the exact same bucket?',
          studentAnswer: 'The hash table crashes with a memory overflow',
          correctAnswer: 'Degrades to O(n) linear search',
          isCorrect: false,
          conceptTested: 'Worst-Case Collision Degradation',
          mistakeType: 'Misconception: Catastrophic Hardware Failure vs Algorithmic Degradation',
          mistakeExplanation: 'Rohan assumed collisions produce runtime crashes rather than linked-list or tree traversal latency (O(n)).',
          remediationTip: 'Demonstrate chaining using visual boxes: show how buckets chain into a linear list without crashing.',
        },
        {
          questionId: 3,
          questionText: 'Which collision resolution strategy probes adjacent slots sequentially: (index + 1) % size?',
          studentAnswer: 'Separate Chaining',
          correctAnswer: 'Linear Probing (Open Addressing)',
          isCorrect: false,
          conceptTested: 'Open Addressing vs Closed Addressing',
          mistakeType: 'Misconception: Inverted Resolution Nomenclature',
          mistakeExplanation: 'Confused linked-list separate chaining with open-address linear probing.',
          remediationTip: 'Provide side-by-side animated diagrams showing memory slot jumping vs pointer following.',
        },
      ],
    },
    {
      id: 'prog_4',
      studentId: 'student_diya',
      studentName: 'Diya Sengupta',
      studentEmail: 'diya.s@school.edu',
      subject: 'Chemistry',
      topic: 'Acid-Base Equilibria & pH Buffers',
      score: 4,
      totalQuestions: 5,
      percentage: 80,
      understandingLevel: 'proficient',
      pointsEarned: 200,
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      answers: [
        {
          questionId: 1,
          questionText: 'What chemical species make up an effective buffer solution?',
          studentAnswer: 'A weak acid and its conjugate base',
          correctAnswer: 'A weak acid and its conjugate base',
          isCorrect: true,
          conceptTested: 'Buffer Composition Principle',
          mistakeType: 'None',
          mistakeExplanation: 'Mastered conjugate pairs and common-ion stabilization.',
          remediationTip: 'Challenge student to calculate Henderson-Hasselbalch ratios for non-equimolar mixtures.',
        },
        {
          questionId: 2,
          questionText: 'What happens to the pH of a solution when [H+] ions are increased by a factor of 100?',
          studentAnswer: 'pH decreases by 2 units',
          correctAnswer: 'pH decreases by 2 units',
          isCorrect: true,
          conceptTested: 'Logarithmic pH Scale Definition',
          mistakeType: 'None',
          mistakeExplanation: 'Understands pH = -log10[H+], so 10^2 concentration change corresponds to -2 pH shift.',
          remediationTip: 'Connect to titration curve inflection zones.',
        },
      ],
    },
  ];

  // Load progress records
  const loadProgress = async () => {
    setLoading(true);
    try {
      if (currentUser && !isDemoUser) {
        const fetched = await fetchStudentProgressFromFirestore();
        if (fetched.length > 0) {
          setRecords(fetched);
        } else {
          setRecords(defaultDemoRecords);
        }
      } else {
        const local = localStorage.getItem('eduplan_student_progress');
        if (local) {
          try {
            setRecords(JSON.parse(local));
          } catch {
            setRecords(defaultDemoRecords);
          }
        } else {
          setRecords(defaultDemoRecords);
        }
      }
    } catch (err) {
      console.warn('Could not fetch student progress from firestore, using sample progress records:', err);
      setRecords(defaultDemoRecords);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [currentUser, isDemoUser]);

  // Aggregate metrics
  const totalAttempts = records.length;
  const averageAccuracy = totalAttempts > 0
    ? Math.round(records.reduce((acc, r) => acc + r.percentage, 0) / totalAttempts)
    : 0;

  const countAdvanced = records.filter((r) => r.understandingLevel === 'advanced').length;
  const countProficient = records.filter((r) => r.understandingLevel === 'proficient').length;
  const countDeveloping = records.filter((r) => r.understandingLevel === 'developing').length;
  const countBeginner = records.filter((r) => r.understandingLevel === 'beginner').length;

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesSubject = selectedSubject === 'All' || r.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'All' || r.understandingLevel === selectedLevel;
    const matchesQuery =
      searchQuery === '' ||
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesLevel && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 border border-indigo-500/20 p-6 sm:p-8 backdrop-blur-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-medium mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Multi-Subject Formative Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Student Progress & Misconception Diagnostics
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Inspect how each student answered diagnostic and quiz questions across all academic disciplines.
              Identify the exact cognitive traps, reasoning slips, and misconceptions they experienced to target your teaching.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
              <span className="text-xs text-slate-400 block">Class Avg Accuracy</span>
              <span className="text-2xl font-black text-emerald-400">{averageAccuracy}%</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
              <span className="text-xs text-slate-400 block">Total Evaluations</span>
              <span className="text-2xl font-black text-blue-400">{totalAttempts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Level Distribution Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Advanced (86-100%)</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{countAdvanced}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Ready for non-routine extensions</p>
        </div>

        <div className="bg-slate-900/60 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Proficient (71-85%)</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{countProficient}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Mastering core standards</p>
        </div>

        <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Developing (41-70%)</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{countDeveloping}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Needs paired guided inquiry</p>
        </div>

        <div className="bg-slate-900/60 border border-rose-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Beginner (0-40%)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{countBeginner}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Requires foundational scaffolding</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/70 border border-white/10 rounded-xl p-4 mb-6 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name or topic..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Subject:</span>
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Filter progress by subject"
            className="bg-slate-800 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Subjects</option>
            {ACADEMIC_SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            aria-label="Filter progress by understanding level"
            className="bg-slate-800 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Understanding Levels</option>
            <option value="advanced">Advanced</option>
            <option value="proficient">Proficient</option>
            <option value="developing">Developing</option>
            <option value="beginner">Beginner</option>
          </select>
        </div>
      </div>

      {/* Progress Records List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <TrendingUp className="w-8 h-8 animate-spin mx-auto text-blue-400 mb-3" />
          <p className="text-sm">Synthesizing student progress analytics...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-white/5 rounded-2xl p-8">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No student assessment records found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your subject or level filters. As students complete diagnostic pre-probes and topic quizzes,
            their detailed answer profiles will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const isAdvanced = record.understandingLevel === 'advanced';
            const isProficient = record.understandingLevel === 'proficient';
            const isDeveloping = record.understandingLevel === 'developing';
            const isBeginner = record.understandingLevel === 'beginner';

            const incorrectAnswers = record.answers.filter((a) => !a.isCorrect);

            return (
              <div
                key={record.id}
                className="bg-slate-900/80 border border-white/10 hover:border-indigo-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Student & Topic Info */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-base font-bold text-white">{record.studentName}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {record.subject}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-sm text-slate-300 font-medium">
                      Topic: <span className="text-white font-semibold">{record.topic}</span>
                    </div>

                    {/* Quick Misconception Teaser if mistakes were made */}
                    {incorrectAnswers.length > 0 ? (
                      <div className="flex items-center gap-2 mt-2 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 max-w-xl">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span className="truncate">
                          Identified Misconception in Q{incorrectAnswers[0].questionId}: {incorrectAnswers[0].mistakeType || 'Reasoning slip'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2 text-xs text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5 max-w-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span>Flawless Conceptual Mastery - Zero Misconceptions Observed</span>
                      </div>
                    )}
                  </div>

                  {/* Score & Level Badge + Drill Down Button */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xl font-black text-white">{record.score}/{record.totalQuestions}</span>
                        <span className="text-xs font-semibold text-slate-400">({record.percentage}%)</span>
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mt-1 ${
                          isAdvanced
                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                            : isProficient
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                            : isDeveloping
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {record.understandingLevel}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveDrillDown(record)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all hover:scale-[1.02]"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Deep Dive Mistakes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drill-down Modal: Detailed Student Answers & Misconception Breakdown */}
      {activeDrillDown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setActiveDrillDown(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Drill-down Header */}
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Brain className="w-5 h-5" />
              <h3 className="text-xl font-bold text-white">Student Answer & Mistake Diagnostic</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Student: <span className="text-white font-semibold">{activeDrillDown.studentName}</span> • Subject:{' '}
              <span className="text-blue-300 font-semibold">{activeDrillDown.subject}</span> • Topic:{' '}
              <span className="text-slate-200 font-medium">{activeDrillDown.topic}</span>
            </p>

            {/* Diagnostic Scorecard Banner */}
            <div className="bg-slate-800/80 border border-white/10 rounded-xl p-4 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Formative Assessment Outcome</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-white">{activeDrillDown.score} / {activeDrillDown.totalQuestions}</span>
                  <span className="text-sm font-semibold text-emerald-400">({activeDrillDown.percentage}% Accuracy)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Diagnosed Readiness Level</span>
                <span className="text-sm font-bold uppercase tracking-wider text-indigo-300">
                  {activeDrillDown.understandingLevel}
                </span>
              </div>
            </div>

            {/* Questions Breakdown List (Scrollable) */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Question-by-Question Diagnostic Analysis ({activeDrillDown.answers.length} Questions Evaluated)
              </div>

              {activeDrillDown.answers.map((ans, idx) => {
                const isCorrect = ans.isCorrect;

                return (
                  <div
                    key={ans.questionId || idx}
                    className={`rounded-xl p-4 border transition-all ${
                      isCorrect
                        ? 'bg-emerald-950/15 border-emerald-500/20'
                        : 'bg-rose-950/15 border-rose-500/30'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/10 text-white">
                          Question {ans.questionId || idx + 1}
                        </span>
                        {ans.conceptTested && (
                          <span className="text-xs text-slate-400">
                            Concept: <span className="text-slate-300">{ans.conceptTested}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Correct Answer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400">
                            <XCircle className="w-4 h-4" /> Incorrect Answer
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Prompt */}
                    <p className="text-sm font-semibold text-white mb-3">{ans.questionText}</p>

                    {/* Answers Comparison Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      <div
                        className={`p-2.5 rounded-lg border ${
                          isCorrect
                            ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-900/20 border-rose-500/30 text-rose-200'
                        }`}
                      >
                        <span className="block text-[11px] text-slate-400 font-semibold mb-0.5">
                          How Student Answered:
                        </span>
                        <span className="font-bold">{ans.studentAnswer}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                        <span className="block text-[11px] text-slate-400 font-semibold mb-0.5">
                          Correct Expected Answer:
                        </span>
                        <span className="font-bold text-emerald-300">{ans.correctAnswer}</span>
                      </div>
                    </div>

                    {/* Mistake Diagnostic & Pedagogical Remediation */}
                    {!isCorrect && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-rose-500/20 text-xs">
                        {ans.mistakeType && (
                          <div className="flex items-start gap-2 text-amber-300">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                            <div>
                              <span className="font-bold">What kind of mistake did the student make: </span>
                              <span>{ans.mistakeType}</span>
                            </div>
                          </div>
                        )}

                        {ans.mistakeExplanation && (
                          <div className="bg-slate-900/90 rounded-lg p-2.5 text-slate-300 border border-white/5">
                            <span className="font-bold text-slate-200 block mb-0.5">Why the student made this mistake:</span>
                            <p>{ans.mistakeExplanation}</p>
                          </div>
                        )}

                        {ans.remediationTip && (
                          <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-lg p-2.5 text-indigo-200 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-indigo-300 block mb-0.5">Recommended Teacher Action / Remediation:</span>
                              <p>{ans.remediationTip}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {isCorrect && ans.mistakeExplanation && (
                      <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-emerald-500/20">
                        <span className="text-emerald-400 font-semibold">Teacher Note: </span>
                        {ans.mistakeExplanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
              <span className="text-xs text-slate-400">
                Evaluation generated by EDUPlan AI Formative Diagnostic Engine
              </span>
              <button
                type="button"
                onClick={() => setActiveDrillDown(null)}
                className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Close Diagnostic View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
