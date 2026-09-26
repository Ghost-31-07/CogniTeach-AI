import React from 'react';
import { GeneratedLessonPackage } from '../types';
import { X, Printer } from 'lucide-react';

interface PrintableViewProps {
  lessonData: GeneratedLessonPackage;
  onClose: () => void;
}

export const PrintableView: React.FC<PrintableViewProps> = ({
  lessonData,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 sm:p-8 flex justify-center">
      <div className="relative w-full max-w-4xl bg-white text-black rounded-2xl p-8 sm:p-12 shadow-2xl my-auto print-area">
        {/* Print Controls (Hidden when printed) */}
        <div className="no-print flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-indigo-700">
              EDUPlan AI Print & PDF Preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1. TEACHER'S LESSON PLAN SECTION */}
        <div className="space-y-6">
          <div className="border-b-2 border-slate-900 pb-4">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest block">
              Curriculum Plan
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-1">
              {lessonData.lessonPlan.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-2 font-medium">
              <span><strong>Topic:</strong> {lessonData.topic}</span>
              <span>•</span>
              <span><strong>Grade:</strong> {lessonData.gradeLevel}</span>
              <span>•</span>
              <span><strong>Duration:</strong> {lessonData.duration}</span>
              {lessonData.understandingProfile && (
                <>
                  <span>•</span>
                  <span><strong>Target Understanding Level:</strong> {lessonData.understandingProfile.assessedLevel.toUpperCase()} ({lessonData.understandingProfile.scorePercentage || 70}%)</span>
                </>
              )}
            </div>

            {lessonData.understandingProfile && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 space-y-1">
                <span className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider block">
                  Adaptive Understanding Calibration
                </span>
                <p className="text-slate-700 text-[11px]">
                  {lessonData.understandingProfile.diagnosticSummary}
                </p>
                <p className="text-slate-600 text-[10px]">
                  <strong>Pedagogical Strategy:</strong> {lessonData.understandingProfile.adaptedTeachingStrategy}
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Lesson Overview</h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {lessonData.lessonPlan.overview}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Learning Objectives (SWBAT)
              </h3>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {lessonData.lessonPlan.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Materials & Standards
              </h3>
              <div className="text-xs text-slate-700 space-y-2">
                <p><strong>Materials:</strong> {lessonData.lessonPlan.materialsNeeded.join(', ')}</p>
                <p><strong>Standards:</strong> {lessonData.lessonPlan.standardsAligned.join('; ')}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Instructional Sequence & Time Allocation
            </h3>
            <div className="space-y-3 border-t border-slate-200 pt-3">
              {lessonData.lessonPlan.timeline.map((step, i) => (
                <div key={i} className="text-xs text-slate-800 pb-2 border-b border-slate-100 last:border-0">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{i + 1}. {step.phase}</span>
                    <span>{step.durationMinutes} min</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{step.description}</p>
                  <p className="text-slate-700 mt-0.5"><em>Teacher:</em> {step.teacherGuidance}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. PRINTABLE STUDENT WORKSHEET (PAGE BREAK) */}
        <div className="print-page-break mt-12 pt-12 border-t-2 border-dashed border-slate-300">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {lessonData.worksheet.title}
              </h2>
              <p className="text-xs text-slate-600 italic mt-1">
                {lessonData.worksheet.instructions}
              </p>
            </div>
          </div>

          {/* Student Header */}
          <div className="grid grid-cols-3 gap-4 border border-slate-300 p-3 rounded text-xs text-slate-800 mb-8 font-medium">
            <div>Name: _______________________________</div>
            <div>Date: _______________</div>
            <div>Period: _________</div>
          </div>

          {/* Worksheet Items */}
          <div className="space-y-8">
            {lessonData.worksheet.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1">
                  {sec.heading}
                </h3>
                {sec.subtext && <p className="text-xs text-slate-500 italic">{sec.subtext}</p>}

                <div className="space-y-6">
                  {sec.items.map((item, qIdx) => {
                    const qNumber = typeof item === 'object' && item?.questionNumber ? item.questionNumber : qIdx + 1;
                    const qPrompt = typeof item === 'object' ? (item?.prompt || (item as any)?.question || '') : String(item);
                    const qType = typeof item === 'object' && item?.type ? item.type : 'open_ended';
                    const qChoices = typeof item === 'object' ? item.choices : undefined;

                    return (
                      <div key={qNumber} className="space-y-2 text-xs">
                        <p className="font-semibold text-slate-900">
                          {qNumber}. {qPrompt}
                        </p>
                        {qType === 'multiple_choice' && qChoices ? (
                          <div className="grid grid-cols-2 gap-2 pl-4">
                            {qChoices.map((c, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 border border-slate-400 rounded-sm inline-block" />
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3 pt-1">
                            <div className="w-full border-b border-slate-300 h-5" />
                            <div className="w-full border-b border-slate-300 h-5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-8 p-4 border border-slate-300 rounded bg-slate-50 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">
                Critical Thinking Challenge:
              </h4>
              <p className="text-xs text-slate-700">
                {lessonData.worksheet.criticalThinkingChallenge}
              </p>
              <div className="w-full border-b border-slate-300 h-6 pt-2" />
              <div className="w-full border-b border-slate-300 h-6" />
            </div>
          </div>
        </div>

        {/* 3. 5-QUESTION QUIZ & ANSWER KEY */}
        <div className="print-page-break mt-12 pt-12 border-t-2 border-dashed border-slate-300">
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {lessonData.quiz.title}
          </h2>
          <p className="text-xs text-slate-600 mb-6 italic">
            {lessonData.quiz.description}
          </p>

          <div className="space-y-6">
            {lessonData.quiz.questions.map((q) => (
              <div key={q.id} className="text-xs text-slate-900 space-y-1.5 pb-4 border-b border-slate-100">
                <p className="font-bold">
                  {q.id}. {q.question}
                </p>
                <div className="grid grid-cols-2 gap-2 pl-4">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2 text-slate-700">
                      <span className="w-3.5 h-3.5 border border-slate-400 rounded-full inline-block text-[9px] text-center">
                        {['A', 'B', 'C', 'D'][oIdx]}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Answer Key Box */}
          <div className="mt-8 p-6 bg-slate-100 rounded-xl border border-slate-300">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Teacher Answer Key & Explanations
            </h3>
            <div className="space-y-2 text-xs text-slate-800">
              {lessonData.quiz.questions.map((q) => (
                <div key={q.id}>
                  <strong>Q{q.id} Answer:</strong> {['A', 'B', 'C', 'D'][q.correctAnswerIndex]} - {q.options[q.correctAnswerIndex]}
                  <p className="text-slate-600 pl-4 italic">{q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
