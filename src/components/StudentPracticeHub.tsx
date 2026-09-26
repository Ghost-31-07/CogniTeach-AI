import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ACADEMIC_SUBJECTS, DiagnosticQuestion, QuestionMistakeAnalysis } from '../types';
import { saveStudentProgressToFirestore } from '../lib/firebase';
import confetti from 'canvas-confetti';
import {
  Brain,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Trophy,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface StudentPracticeHubProps {
  onNavigateDoubts?: () => void;
  onNavigateLeaderboard?: () => void;
}

export const StudentPracticeHub: React.FC<StudentPracticeHubProps> = ({
  onNavigateDoubts,
  onNavigateLeaderboard,
}) => {
  const { currentUser, userProfile, isDemoUser } = useAuth();

  // Configuration state
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [topicInput, setTopicInput] = useState<string>('Newton’s Laws of Motion & Friction');
  const [gradeLevel, setGradeLevel] = useState<string>('Grade 10');

  // Quiz state
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmittingAnswers, setIsSubmittingAnswers] = useState<boolean>(false);

  // Result state
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [evaluatedAnswers, setEvaluatedAnswers] = useState<QuestionMistakeAnalysis[]>([]);
  const [scoreAchieved, setScoreAchieved] = useState<{ score: number; total: number; percentage: number }>({
    score: 0,
    total: 0,
    percentage: 0,
  });
  const [diagnosedLevel, setDiagnosedLevel] = useState<'beginner' | 'developing' | 'proficient' | 'advanced'>('developing');
  const [pointsAwarded, setPointsAwarded] = useState<number>(0);

  // Quick subject suggestions
  const subjectTopicPresets: Record<string, string[]> = {
    'Physics': ['Newton’s Laws of Motion & Friction', 'Electromagnetic Induction', 'Thermodynamics & Heat Transfer'],
    'Mathematics': ['Quadratic Equations & Roots', 'Implicit Differentiation', 'Pythagorean Geometry & Vectors'],
    'Chemistry': ['Chemical Bonding & Polarity', 'Acid-Base Equilibria & pH Buffers', 'Redox Reactions'],
    'Computer Science & AI': ['Binary Search & Big-O Notation', 'Recursion & Call Stacks', 'Neural Network Backpropagation'],
    'Biology & Life Sciences': ['Cellular Respiration & ATP', 'Mendelian Genetics & Punnett Squares', 'Photosynthesis Mechanisms'],
    'History & Social Studies': ['The Industrial Revolution', 'Causes of the First World War', 'The Renaissance'],
  };

  // 1. Fetch or generate diagnostic probe
  const handleStartPractice = async () => {
    if (!topicInput.trim()) return;
    setIsLoadingQuestions(true);
    setHasCompleted(false);
    setSelectedAnswers({});
    setEvaluatedAnswers([]);

    try {
      const res = await fetch('/api/generate-diagnostic-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput.trim(),
          gradeLevel,
          subject: selectedSubject,
        }),
      });

      const data = await res.json();
      if (data.diagnosticQuestions && data.diagnosticQuestions.length > 0) {
        setQuestions(data.diagnosticQuestions);
      }
    } catch (err) {
      console.error('Error generating diagnostic probe:', err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // 2. Select option for question
  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  // 3. Submit answers & analyze mistakes
  const handleSubmitEvaluation = async () => {
    setIsSubmittingAnswers(true);

    const formattedAnswers = questions.map((q) => {
      const chosenIdx = selectedAnswers[q.id];
      const studentAnsText = chosenIdx !== undefined ? q.options[chosenIdx] : 'No answer provided';
      const correctAnsText = q.options[q.correctAnswerIndex];
      const isCorrect = chosenIdx === q.correctAnswerIndex;

      return {
        questionId: q.id,
        questionText: q.question,
        studentAnswer: studentAnsText,
        correctAnswer: correctAnsText,
        isCorrect,
        conceptTested: q.conceptTested,
        options: q.options,
      };
    });

    let correctCount = formattedAnswers.filter((a) => a.isCorrect).length;
    const totalQ = questions.length;
    const pct = Math.round((correctCount / totalQ) * 100);

    let level: 'beginner' | 'developing' | 'proficient' | 'advanced' = 'developing';
    if (pct >= 85) level = 'advanced';
    else if (pct >= 70) level = 'proficient';
    else if (pct >= 40) level = 'developing';
    else level = 'beginner';

    const earnedXP = 100 + correctCount * 25; // 100 XP baseline + 25 per correct

    try {
      // Call AI endpoint to diagnose mistakes
      const evalRes = await fetch('/api/evaluate-student-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput,
          subject: selectedSubject,
          userAnswers: formattedAnswers,
        }),
      });

      const evalData = await evalRes.json();
      const finalEvaluated = evalData.evaluatedAnswers || formattedAnswers;

      setEvaluatedAnswers(finalEvaluated);
      setScoreAchieved({ score: correctCount, total: totalQ, percentage: pct });
      setDiagnosedLevel(level);
      setPointsAwarded(earnedXP);
      setHasCompleted(true);

      // Save to Firestore & local storage
      const studentName = userProfile?.displayName || 'Alex Rivera';
      const studentEmail = userProfile?.email || 'student@eduplan.ai';
      const studentId = currentUser?.uid || 'student_local';

      const progressRecord = {
        studentId,
        studentName,
        studentEmail,
        subject: selectedSubject,
        topic: topicInput,
        score: correctCount,
        totalQuestions: totalQ,
        percentage: pct,
        understandingLevel: level,
        pointsEarned: earnedXP,
        answers: finalEvaluated,
      };

      if (currentUser && !isDemoUser) {
        await saveStudentProgressToFirestore(progressRecord);
      } else {
        const existing = JSON.parse(localStorage.getItem('eduplan_student_progress') || '[]');
        const newRecord = {
          id: `prog_${Date.now()}`,
          ...progressRecord,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('eduplan_student_progress', JSON.stringify([newRecord, ...existing]));
      }

      // Celebrate
      if (pct >= 60) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Error during answer evaluation:', err);
    } finally {
      setIsSubmittingAnswers(false);
    }
  };

  const allAnswered = questions.length > 0 && questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
          <Brain className="w-3.5 h-3.5" />
          <span>Interactive Student Practice & Diagnostic Probe</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Multi-Subject Learning & Mastery Hub
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-xl mx-auto">
          Test your intuition on any topic. Receive immediate AI-powered diagnosis of reasoning mistakes,
          earn monthly leaderboard XP, and clarify remaining doubts with faculty!
        </p>
      </div>

      {/* Practice Configuration Box */}
      {!hasCompleted && (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Subject / Discipline</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  const presets = subjectTopicPresets[e.target.value];
                  if (presets && presets.length > 0) setTopicInput(presets[0]);
                }}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {ACADEMIC_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Grade Level</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Grade 8 (Middle School)">Grade 8 (Middle School)</option>
                <option value="Grade 9 (High School Freshman)">Grade 9 (Freshman)</option>
                <option value="Grade 10">Grade 10 (Sophomore)</option>
                <option value="Grade 11 (AP / IB / Advanced)">Grade 11 (AP / IB)</option>
                <option value="Grade 12 (Senior / College Prep)">Grade 12 (College Prep)</option>
                <option value="Undergraduate College">Undergraduate College</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-300 mb-1">Topic or Concept to Practice</label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g. Kinematics, Quadratic Formula, Buffer Solutions, Binary Search"
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />

            {/* Quick Topic Chips */}
            {subjectTopicPresets[selectedSubject] && (
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="text-[11px] text-slate-400">Popular topics:</span>
                {subjectTopicPresets[selectedSubject].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopicInput(t)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleStartPractice}
            disabled={isLoadingQuestions || !topicInput.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoadingQuestions ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Calibrating Diagnostic Questions with AI...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Start Practice Quiz & Earn XP</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Questions Answering Flow */}
      {questions.length > 0 && !hasCompleted && (
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
            <span>
              Subject: <strong className="text-white">{selectedSubject}</strong> • Topic:{' '}
              <strong className="text-blue-300">{topicInput}</strong>
            </span>
            <span>
              Answered {Object.keys(selectedAnswers).length} of {questions.length} Questions
            </span>
          </div>

          {questions.map((q, qIndex) => {
            const currentSelected = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 shadow-md backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Question {qIndex + 1}
                  </span>
                  {q.conceptTested && (
                    <span className="text-xs text-slate-400">
                      Testing: <span className="text-slate-300 font-medium">{q.conceptTested}</span>
                    </span>
                  )}
                </div>

                <p className="text-base font-semibold text-white mb-4 leading-relaxed">{q.question}</p>

                <div className="space-y-2.5">
                  {q.options.map((opt, optIndex) => {
                    const isChecked = currentSelected === optIndex;

                    return (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'bg-blue-600/20 border-blue-500 text-white font-medium shadow-md shadow-blue-500/10'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                            isChecked
                              ? 'border-blue-400 bg-blue-500 text-white'
                              : 'border-slate-500 text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </div>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-slate-400">
              {allAnswered
                ? 'All questions answered! Click submit to diagnose your understanding.'
                : `Please answer all ${questions.length} questions before submitting.`}
            </span>

            <button
              onClick={handleSubmitEvaluation}
              disabled={!allAnswered || isSubmittingAnswers}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-40 hover:scale-[1.02]"
            >
              {isSubmittingAnswers ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Analyzing Answers & Diagnosing Mistakes...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit & Analyze My Performance</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Completion & Mistake Analysis View */}
      {hasCompleted && (
        <div className="space-y-6">
          {/* Result Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400/40 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 mb-2">
              +{pointsAwarded} Leaderboard XP Earned!
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Assessment Complete: {scoreAchieved.percentage}% Accuracy
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              You scored <span className="font-bold text-white">{scoreAchieved.score}</span> out of{' '}
              <span className="font-bold text-white">{scoreAchieved.total}</span> questions. Understanding Level:{' '}
              <span className="font-bold uppercase text-blue-300">{diagnosedLevel}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  setHasCompleted(false);
                  setQuestions([]);
                  setSelectedAnswers({});
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Another Topic</span>
              </button>

              {onNavigateLeaderboard && (
                <button
                  onClick={onNavigateLeaderboard}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold transition-colors"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Check Updated Leaderboard Rank</span>
                </button>
              )}

              {onNavigateDoubts && (
                <button
                  onClick={onNavigateDoubts}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Have a Doubt? Ask Faculty</span>
                </button>
              )}
            </div>
          </div>

          {/* Detailed Mistake Diagnosis Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Diagnostic Mistake Breakdown ({evaluatedAnswers.length} Questions)
            </h3>

            {evaluatedAnswers.map((ans, idx) => {
              const isCorrect = ans.isCorrect;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 border backdrop-blur-md transition-all ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-slate-300">
                      Question {ans.questionId || idx + 1} • {ans.conceptTested || selectedSubject}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer (+25 Bonus XP)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400">
                        <XCircle className="w-4 h-4" /> Needs Correction
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-white mb-3">{ans.questionText}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs mb-3">
                    <div
                      className={`p-3 rounded-xl border ${
                        isCorrect
                          ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-100'
                          : 'bg-rose-900/30 border-rose-500/40 text-rose-100'
                      }`}
                    >
                      <span className="text-[11px] block font-semibold text-slate-400 mb-0.5">Your Selected Answer:</span>
                      <span className="font-bold">{ans.studentAnswer}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                      <span className="text-[11px] block font-semibold text-slate-400 mb-0.5">Correct Answer:</span>
                      <span className="font-bold text-emerald-300">{ans.correctAnswer}</span>
                    </div>
                  </div>

                  {/* Cognitive Mistake Explanation */}
                  {!isCorrect && (
                    <div className="space-y-2 mt-3 pt-3 border-t border-rose-500/20 text-xs">
                      {ans.mistakeType && (
                        <div className="flex items-start gap-2 text-amber-300 font-semibold">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span>What kind of mistake you made: </span>
                            <span className="text-amber-200 font-bold">{ans.mistakeType}</span>
                          </div>
                        </div>
                      )}

                      {ans.mistakeExplanation && (
                        <div className="bg-slate-900/80 rounded-xl p-3 border border-white/5 text-slate-300 leading-relaxed">
                          <span className="font-bold text-white block mb-1">Why this mistake happened:</span>
                          <p>{ans.mistakeExplanation}</p>
                        </div>
                      )}

                      {ans.remediationTip && (
                        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 text-indigo-200 flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-indigo-300 block mb-0.5">How to remember this correctly:</span>
                            <p>{ans.remediationTip}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isCorrect && ans.mistakeExplanation && (
                    <div className="text-xs text-slate-300 mt-2 pt-2 border-t border-emerald-500/20">
                      <span className="text-emerald-400 font-bold">Concept Key: </span>
                      {ans.mistakeExplanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
