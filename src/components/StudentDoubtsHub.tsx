import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DoubtItem, ACADEMIC_SUBJECTS } from '../types';
import {
  fetchDoubtsFromFirestore,
  saveDoubtToFirestore,
  updateDoubtAnswerInFirestore,
  resolveDoubtInFirestore,
} from '../lib/firebase';
import {
  HelpCircle,
  MessageSquare,
  CheckCircle,
  Clock,
  Sparkles,
  Send,
  Filter,
  PlusCircle,
  X,
  Search,
  BookOpen,
  User,
  AlertCircle,
} from 'lucide-react';

export const StudentDoubtsHub: React.FC = () => {
  const { currentUser, userProfile, userRole, isDemoUser } = useAuth();

  const [doubts, setDoubts] = useState<DoubtItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Ask Doubt Modal State
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);
  const [newSubject, setNewSubject] = useState<string>('Mathematics');
  const [newTopic, setNewTopic] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [isSubmittingDoubt, setIsSubmittingDoubt] = useState<boolean>(false);

  // Faculty Respond Modal State
  const [activeDoubtToRespond, setActiveDoubtToRespond] = useState<DoubtItem | null>(null);
  const [responseDraft, setResponseDraft] = useState<string>('');
  const [isGeneratingAiDraft, setIsGeneratingAiDraft] = useState<boolean>(false);
  const [isSavingResponse, setIsSavingResponse] = useState<boolean>(false);

  // Initial Seeded Doubts for Demo/First Run across subjects
  const defaultSampleDoubts: DoubtItem[] = [
    {
      id: 'doubt_sample_1',
      studentId: 'student_priyanshu',
      studentName: 'Priyanshu Patel',
      studentEmail: 'priyanshu.patel@school.edu',
      subject: 'Physics',
      topic: 'Electromagnetic Induction & Faraday’s Law',
      question:
        'When a magnet is moved faster into a closed copper loop, why does the induced voltage increase even though the magnetic field strength of the magnet stays constant?',
      status: 'answered',
      teacherResponse: `Great question, Priyanshu! 🎯

Faraday’s Law states that Induced Voltage = -dΦ/dt (the rate of change of magnetic flux over time). 

Even though the magnet's physical magnetic field (B) doesn't change, moving it faster means the magnetic flux through the loop changes in a shorter time interval (smaller dt). Therefore, the time derivative dΦ/dt is much larger, creating a significantly stronger induced electromotive force (voltage)!

**Quick Check:** If you keep the magnet stationary inside the loop, what will the induced voltage be? (Answer: Exactly zero, because dt is passing without any change in flux!)`,
      teacherName: 'Prof. Rajesh Sharma',
      teacherId: 'prof_sharma',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'doubt_sample_2',
      studentId: 'student_ananya',
      studentName: 'Ananya Iyer',
      studentEmail: 'ananya.iyer@school.edu',
      subject: 'Mathematics',
      topic: 'Implicit Differentiation in Calculus',
      question:
        'When differentiating x² + y² = 25 with respect to x, why do we multiply by dy/dx only on the y term, but not on the x term?',
      status: 'answered',
      teacherResponse: `Wonderful conceptual doubt, Ananya! 📐

Remember that y is not an independent variable; y is an unknown function of x, so y = f(x).

When applying the Chain Rule to [y(x)]²:
The outer derivative of ( )² with respect to y is 2y. Then by the Chain Rule, we must multiply by the derivative of the inside with respect to x, which is d(y)/dx.

On the other hand, for x², the derivative with respect to x is 2x · (dx/dx). Since dx/dx is just 1, we don't need to write it!`,
      teacherName: 'Prof. Rajesh Sharma',
      teacherId: 'prof_sharma',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 'doubt_sample_3',
      studentId: 'student_rohan',
      studentName: 'Rohan Verma',
      studentEmail: 'rohan.verma@school.edu',
      subject: 'Computer Science & AI',
      topic: 'Time Complexity of Binary Search',
      question:
        'Why does Binary Search have O(log n) time complexity rather than O(n/2)? If we divide the search space in half each step, shouldn’t it be half of n?',
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: 'doubt_sample_4',
      studentId: 'student_diya',
      studentName: 'Diya Sengupta',
      studentEmail: 'diya.s@school.edu',
      subject: 'Chemistry',
      topic: 'Le Chatelier’s Principle & Equilibrium',
      question:
        'If we add an inert gas like Argon to an equilibrium mixture at constant volume, why doesn’t the equilibrium shift even though the total pressure of the container increases?',
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];

  // Fetch doubts
  const loadDoubts = async () => {
    setLoading(true);
    try {
      if (currentUser && !isDemoUser) {
        const fetched = await fetchDoubtsFromFirestore();
        if (fetched.length > 0) {
          setDoubts(fetched);
        } else {
          setDoubts(defaultSampleDoubts);
        }
      } else {
        // Use demo items stored in localStorage or default
        const local = localStorage.getItem('eduplan_doubts');
        if (local) {
          try {
            setDoubts(JSON.parse(local));
          } catch {
            setDoubts(defaultSampleDoubts);
          }
        } else {
          setDoubts(defaultSampleDoubts);
        }
      }
    } catch (err) {
      console.warn('Could not fetch doubts from firestore, using sample doubts:', err);
      setDoubts(defaultSampleDoubts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoubts();
  }, [currentUser, isDemoUser]);

  // Save to local storage for persistence in demo mode
  const syncDoubtsLocally = (updated: DoubtItem[]) => {
    setDoubts(updated);
    localStorage.setItem('eduplan_doubts', JSON.stringify(updated));
  };

  // Submit new doubt (Student)
  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || !newQuestion.trim()) return;

    setIsSubmittingDoubt(true);
    const studentName = userProfile?.displayName || 'Student Scholar';
    const studentEmail = userProfile?.email || 'student@eduplan.ai';
    const studentUid = currentUser?.uid || `student_local_${Date.now()}`;

    const newDoubtData = {
      studentId: studentUid,
      studentName,
      studentEmail,
      subject: newSubject,
      topic: newTopic.trim(),
      question: newQuestion.trim(),
    };

    try {
      if (currentUser && !isDemoUser) {
        const saved = await saveDoubtToFirestore(newDoubtData);
        setDoubts((prev) => [saved, ...prev]);
      } else {
        const localDoubt: DoubtItem = {
          id: `doubt_${Date.now()}`,
          ...newDoubtData,
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        syncDoubtsLocally([localDoubt, ...doubts]);
      }

      setNewTopic('');
      setNewQuestion('');
      setIsAskModalOpen(false);
    } catch (err) {
      console.error('Error submitting doubt:', err);
    } finally {
      setIsSubmittingDoubt(false);
    }
  };

  // Faculty AI Assistant Draft
  const handleGenerateAiResponse = async () => {
    if (!activeDoubtToRespond) return;
    setIsGeneratingAiDraft(true);
    try {
      const res = await fetch('/api/generate-doubt-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeDoubtToRespond.subject,
          topic: activeDoubtToRespond.topic,
          question: activeDoubtToRespond.question,
          studentName: activeDoubtToRespond.studentName,
        }),
      });
      const data = await res.json();
      if (data.draftResponse) {
        setResponseDraft(data.draftResponse);
      }
    } catch (err) {
      console.error('Error generating AI answer draft:', err);
    } finally {
      setIsGeneratingAiDraft(false);
    }
  };

  // Faculty Save Response
  const handleSaveResponse = async () => {
    if (!activeDoubtToRespond || !responseDraft.trim()) return;
    setIsSavingResponse(true);
    const teacherName = userProfile?.displayName || 'Professor Evelyn Vance';
    const teacherId = currentUser?.uid || 'teacher_local_uid';

    try {
      if (currentUser && !isDemoUser) {
        await updateDoubtAnswerInFirestore(
          activeDoubtToRespond.id,
          responseDraft.trim(),
          teacherName,
          teacherId,
          'answered'
        );
      }

      const updated = doubts.map((d) =>
        d.id === activeDoubtToRespond.id
          ? {
              ...d,
              status: 'answered' as const,
              teacherResponse: responseDraft.trim(),
              teacherName,
              teacherId,
              updatedAt: new Date().toISOString(),
            }
          : d
      );

      syncDoubtsLocally(updated);
      setActiveDoubtToRespond(null);
      setResponseDraft('');
    } catch (err) {
      console.error('Error saving teacher response:', err);
    } finally {
      setIsSavingResponse(false);
    }
  };

  // Resolve Doubt
  const handleResolveDoubt = async (doubtId: string) => {
    try {
      if (currentUser && !isDemoUser) {
        await resolveDoubtInFirestore(doubtId);
      }
      const updated = doubts.map((d) =>
        d.id === doubtId ? { ...d, status: 'resolved' as const, updatedAt: new Date().toISOString() } : d
      );
      syncDoubtsLocally(updated);
    } catch (err) {
      console.error('Error resolving doubt:', err);
    }
  };

  // Filtered list
  const filteredDoubts = doubts.filter((d) => {
    const matchesSubject = selectedSubject === 'All' || d.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'All' || d.status === selectedStatus;
    const matchesQuery =
      searchQuery === '' ||
      d.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesStatus && matchesQuery;
  });

  const isFaculty = userRole === 'faculty';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-medium mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Multi-Subject Academic Inquiry Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isFaculty ? 'Faculty Doubts & Clarification Desk' : 'Student Question & Doubts Portal'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {isFaculty
                ? 'Review inquiries from students across all disciplines. Provide targeted pedagogical guidance, address misconceptions, and mentor learners in real time.'
                : 'Have a doubt on any topic or subject? Ask questions directly to faculty, view detailed conceptual breakdowns, and learn from peer questions.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isFaculty ? (
              <button
                onClick={() => setIsAskModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ask a Doubt</span>
              </button>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-right">
                <span className="text-xs text-slate-400 block">Pending Inquiries</span>
                <span className="text-lg font-bold text-amber-400">
                  {doubts.filter((d) => d.status === 'open').length} Questions Awaiting Answer
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 mb-8 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, keyword, or student name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Subject:</span>
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Filter doubts by subject"
            className="bg-slate-800 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Subjects ({doubts.length})</option>
            {ACADEMIC_SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter doubts by status"
            className="bg-slate-800 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="open">⏳ Pending Answer</option>
            <option value="answered">💬 Answered by Faculty</option>
            <option value="resolved">✅ Fully Resolved</option>
          </select>
        </div>
      </div>

      {/* Doubts List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Clock className="w-8 h-8 animate-spin mx-auto text-blue-400 mb-3" />
          <p className="text-sm">Retrieving academic inquiries...</p>
        </div>
      ) : filteredDoubts.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-white/5 rounded-2xl p-8">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No questions found matching criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {selectedSubject !== 'All'
              ? `No inquiries currently listed under ${selectedSubject}. Try switching subjects or submit a new question!`
              : 'Be the first scholar to ask a question! Faculty mentors respond promptly.'}
          </p>
          {!isFaculty && (
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Ask a Question Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => {
            const isOpen = doubt.status === 'open';
            const isAnswered = doubt.status === 'answered';
            const isResolved = doubt.status === 'resolved';

            return (
              <div
                key={doubt.id}
                className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-md transition-all hover:border-blue-500/30"
              >
                {/* Top Meta info */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-blue-500/10 border border-blue-500/30 text-blue-300">
                      {doubt.subject}
                    </span>
                    <span className="text-xs text-slate-400">
                      Topic: <span className="text-slate-200 font-medium">{doubt.topic}</span>
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {isOpen && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        Pending Teacher Answer
                      </span>
                    )}
                    {isAnswered && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        Answered by Faculty
                      </span>
                    )}
                    {isResolved && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        <CheckCircle className="w-3 h-3" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">
                        <span className="font-semibold text-slate-300">{doubt.studentName}</span> asked:
                      </div>
                      <p className="text-sm sm:text-base text-white font-medium leading-relaxed">{doubt.question}</p>
                    </div>
                  </div>
                </div>

                {/* Teacher Response Section if answered */}
                {doubt.teacherResponse && (
                  <div className="mt-4 pt-4 border-t border-white/5 pl-4 sm:pl-8 border-l-2 border-l-emerald-500/40 bg-emerald-950/10 rounded-r-xl p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                          <BookOpen className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-emerald-300">
                          {doubt.teacherName || 'Faculty Instructor'} responded:
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(doubt.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed pl-8">
                      {doubt.teacherResponse}
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Posted {new Date(doubt.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Faculty Action: Answer or Edit Response */}
                    {isFaculty && (
                      <button
                        onClick={() => {
                          setActiveDoubtToRespond(doubt);
                          setResponseDraft(doubt.teacherResponse || '');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 font-medium transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{doubt.teacherResponse ? 'Edit Response' : 'Answer Question'}</span>
                      </button>
                    )}

                    {/* Student/Faculty Action: Mark Resolved */}
                    {!isResolved && doubt.teacherResponse && (
                      <button
                        onClick={() => handleResolveDoubt(doubt.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-200 font-medium transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Ask a Doubt (Student) */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAskModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <HelpCircle className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Ask an Academic Doubt</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Submit your inquiry to faculty mentors. Be specific about what concept or problem is confusing you.
            </p>

            <form onSubmit={handleAskDoubt} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Discipline</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {ACADEMIC_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic or Lesson Unit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Equations, Newton's Third Law, Photosynthesis"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Question / Doubt Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain clearly what you understand so far and where you are getting stuck..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDoubt}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSubmittingDoubt ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Post Question to Faculty</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Faculty Respond & Clear Doubt */}
      {activeDoubtToRespond && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setActiveDoubtToRespond(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Faculty Guidance & Resolution</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Responding to <span className="text-white font-semibold">{activeDoubtToRespond.studentName}</span> on{' '}
              <span className="text-blue-300 font-medium">{activeDoubtToRespond.subject}</span> ({activeDoubtToRespond.topic})
            </p>

            {/* Student's Question Card */}
            <div className="bg-slate-800/80 border border-white/10 rounded-xl p-3.5 mb-4 text-xs text-slate-200">
              <span className="text-slate-400 block font-semibold mb-1">Student's Question:</span>
              <p className="italic text-white text-sm">"{activeDoubtToRespond.question}"</p>
            </div>

            {/* AI Assistant Quick Draft Button */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <label className="text-xs font-semibold text-slate-300">Teacher Explanation & Guidance</label>
              <button
                type="button"
                onClick={handleGenerateAiResponse}
                disabled={isGeneratingAiDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{isGeneratingAiDraft ? 'Drafting...' : 'Draft with AI Pedagogical Assistant'}</span>
              </button>
            </div>

            {/* Teacher's Response Textarea */}
            <div className="flex-1 min-h-[220px]">
              <textarea
                value={responseDraft}
                onChange={(e) => setResponseDraft(e.target.value)}
                placeholder="Write an encouraging, step-by-step conceptual explanation. Highlight common misconceptions and provide a quick check..."
                className="w-full h-full bg-slate-800 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-mono"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-4">
              <button
                type="button"
                onClick={() => setActiveDoubtToRespond(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveResponse}
                disabled={isSavingResponse || !responseDraft.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                {isSavingResponse ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send Response to Student</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
