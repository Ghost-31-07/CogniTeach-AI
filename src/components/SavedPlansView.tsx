import React, { useState } from 'react';
import {
  FolderHeart,
  Search,
  BookOpen,
  Calendar,
  Clock,
  Printer,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { SavedPlanItem, GeneratedLessonPackage } from '../types';
import { deleteLessonPlanFromFirestore } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface SavedPlansViewProps {
  savedPlans: SavedPlanItem[];
  setSavedPlans: React.Dispatch<React.SetStateAction<SavedPlanItem[]>>;
  onOpenPlan: (plan: GeneratedLessonPackage) => void;
  onTriggerPrint: (plan: GeneratedLessonPackage) => void;
  onNavigateDashboard: () => void;
}

export const SavedPlansView: React.FC<SavedPlansViewProps> = ({
  savedPlans,
  setSavedPlans,
  onOpenPlan,
  onTriggerPrint,
  onNavigateDashboard,
}) => {
  const { currentUser, isDemoUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const filteredPlans = savedPlans.filter((p) =>
    p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    setIsDeletingId(planId);
    try {
      if (!isDemoUser) {
        await deleteLessonPlanFromFirestore(currentUser.uid, planId);
      }
      setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleOpenConverted = (item: SavedPlanItem) => {
    let parsedQuiz: any = { title: 'Quiz', description: '', questions: [], answerKeySummary: [] };
    try {
      parsedQuiz = JSON.parse(item.quizJson);
    } catch (e) {
      // ignore parse err
    }

    const pkg: GeneratedLessonPackage = {
      topic: item.topic,
      gradeLevel: item.gradeLevel,
      duration: item.duration,
      lessonPlan: {
        title: item.topic,
        overview: 'Loaded from your saved profile archives.',
        learningObjectives: ['Review the full markdown plan below.'],
        materialsNeeded: ['Standard classroom materials.'],
        standardsAligned: ['Curriculum Aligned'],
        timeline: [
          {
            phase: 'Instructional Flow',
            durationMinutes: 45,
            description: 'See full lesson plan markdown',
            teacherGuidance: 'Review saved plan',
            studentActivity: 'Active learning',
          },
        ],
        differentiation: {
          advancedLearners: 'Enrichment available',
          supportLearners: 'Scaffolded supports available',
          eslSupport: 'Bilingual glossary available',
        },
        assessment: 'Formative quiz & exit ticket',
        exitTicket: 'Synthesize core takeaways',
      },
      worksheet: {
        title: `${item.topic} - Student Worksheet`,
        gradeLevel: item.gradeLevel,
        instructions: 'Read each prompt carefully and write your answers in the designated spaces.',
        sections: [
          {
            heading: 'Part 1: Key Concepts',
            subtext: 'See full worksheet markdown',
            items: [
              {
                questionNumber: 1,
                prompt: 'Refer to complete printable worksheet tab.',
                type: 'open_ended',
                scaffoldLines: 3,
              },
            ],
          },
        ],
        criticalThinkingChallenge: 'How would you apply this concept to a novel real-world challenge?',
      },
      quiz: parsedQuiz,
      markdown: {
        lessonPlanMd: item.lessonPlanMarkdown,
        worksheetMd: item.worksheetMarkdown,
        quizMd: `Quiz for ${item.topic}`,
      },
    };

    onOpenPlan(pkg);
  };

  return (
    <div className="w-full px-4 sm:px-8 py-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <FolderHeart className="w-4 h-4 text-pink-400" /> Educator Vault
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Saved Curricula & Handouts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal library of AI-generated lesson packages, worksheets, and quizzes.
          </p>
        </div>

        <button
          onClick={onNavigateDashboard}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Lesson Plan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by topic or grade level..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
        />
      </div>

      {/* Grid of Saved Plans */}
      {filteredPlans.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
            <FolderHeart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Lesson Plans Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you generate a lesson plan on the dashboard, click "Save to Profile" to store it securely in your cloud vault.
          </p>
          <button
            onClick={onNavigateDashboard}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Create Your First Plan →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handleOpenConverted(plan)}
              className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-indigo-400/50 transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1 shadow-[0_10px_30px_-10px_rgba(99,102,241,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {plan.gradeLevel}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {plan.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {plan.topic}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                  {plan.lessonPlanMarkdown.substring(0, 150)}...
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(plan.id, e)}
                    disabled={isDeletingId === plan.id}
                    aria-label="Delete lesson plan"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center font-semibold text-xs">
                    Open <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
