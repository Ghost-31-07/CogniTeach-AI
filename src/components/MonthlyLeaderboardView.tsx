import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MonthlyLeaderboardEntry, ACADEMIC_SUBJECTS } from '../types';
import { fetchMonthlyLeaderboardFromFirestore, getDemoLeaderboard } from '../lib/firebase';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  Award,
  Crown,
  Medal,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  ArrowUp,
  CheckCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';

interface MonthlyLeaderboardViewProps {
  onNavigatePractice?: () => void;
}

export const MonthlyLeaderboardView: React.FC<MonthlyLeaderboardViewProps> = ({ onNavigatePractice }) => {
  const { userProfile, userRole } = useAuth();

  const [leaderboard, setLeaderboard] = useState<MonthlyLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMonthlyLeaderboardFromFirestore();
        // If current student has points, make sure they are reflected
        if (userRole === 'student' && userProfile?.studentPoints) {
          const userIdx = data.findIndex((e) => e.displayName.includes('You') || e.userId === userProfile.userId);
          if (userIdx >= 0) {
            data[userIdx].totalPoints = Math.max(data[userIdx].totalPoints, userProfile.studentPoints);
            data[userIdx].streak = Math.max(data[userIdx].streak, userProfile.studentStreak || 1);
          }
          data.sort((a, b) => b.totalPoints - a.totalPoints);
          data.forEach((item, i) => {
            item.rank = i + 1;
          });
        }
        setLeaderboard(data);
      } catch (err) {
        console.warn('Error fetching leaderboard:', err);
        setLeaderboard(getDemoLeaderboard());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userProfile, userRole]);

  // Celebrate with confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
      });
    } catch {
      // ignore
    }
  };

  const isStudent = userRole === 'student';
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);

  // Find current student rank if student
  const studentRankItem = isStudent
    ? leaderboard.find(
        (e) => e.userId === userProfile?.userId || e.displayName.includes('You') || e.displayName === userProfile?.displayName
      ) || leaderboard[3]
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/60 via-purple-950/50 to-indigo-950/60 border border-amber-500/30 p-6 sm:p-10 backdrop-blur-xl mb-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Monthly Academic Honors • {currentMonthName} {currentYear}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Student Excellence Leaderboard</span>
              <Sparkles className="w-7 h-7 text-amber-400 animate-pulse hidden sm:inline" />
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Celebrating top scholars across all subjects! Earn XP points by completing topic diagnostic probes,
              practicing quizzes, clarifying doubts, and maintaining your daily study streak.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={triggerCelebration}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Cheer Cohort!</span>
            </button>

            {isStudent && onNavigatePractice && (
              <button
                onClick={onNavigatePractice}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4" />
                <span>Practice Now & Climb (+100 XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* Motivational Banner for Student */}
        {isStudent && studentRankItem && (
          <div className="mt-6 pt-6 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-4 bg-amber-500/5 rounded-2xl p-4 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-base">
                #{studentRankItem.rank}
              </div>
              <div>
                <span className="text-xs text-amber-200/90 font-medium">Your Current Standing:</span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{studentRankItem.displayName}</span>
                  <span className="text-amber-400 font-extrabold">{studentRankItem.totalPoints} XP</span>
                  <span className="text-xs text-slate-400">• 🔥 {studentRankItem.streak}-Day Streak</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-amber-200 flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-emerald-400" />
              <span>
                {studentRankItem.rank > 1
                  ? `Only ${top1?.totalPoints ? top1.totalPoints - studentRankItem.totalPoints : 100} XP points away from #1 spot!`
                  : 'You are leading the academy! Defend your #1 rank!'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Top 3 Podium (1st, 2nd, 3rd) */}
      {!loading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
          {/* 2nd Place (Silver) */}
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-400/30 rounded-3xl p-6 text-center backdrop-blur-md relative transform md:-translate-y-2 shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-300/10 border-2 border-slate-300 flex items-center justify-center mb-3 shadow-lg shadow-slate-400/20">
              <Medal className="w-7 h-7 text-slate-200" />
            </div>
            <div className="inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-400/20 text-slate-200 border border-slate-300/30 mb-2">
              2nd Place • Silver
            </div>
            <h3 className="text-lg font-bold text-white truncate">{top2?.displayName}</h3>
            <div className="text-2xl font-black text-slate-100 my-1">{top2?.totalPoints} XP</div>
            <p className="text-xs text-slate-400 font-medium">{top2?.topSubject}</p>

            <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/5 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> {top2?.streak}d streak
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {top2?.averageScore}% avg
              </span>
            </div>
          </div>

          {/* 1st Place (Gold / Champion) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-900/40 via-slate-900/90 to-amber-950/40 border-2 border-amber-400/50 rounded-3xl p-7 text-center backdrop-blur-xl relative transform md:-translate-y-6 shadow-2xl shadow-amber-500/20">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 shadow-lg">
              <Crown className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>

            <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mt-2 mb-3 shadow-xl shadow-amber-400/30">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>

            <div className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-400 text-slate-950 shadow-md mb-2">
              🏆 Champion • 1st Place
            </div>

            <h3 className="text-xl font-extrabold text-white truncate">{top1?.displayName}</h3>
            <div className="text-3xl font-black text-amber-300 my-1.5">{top1?.totalPoints} XP</div>
            <p className="text-xs text-amber-200 font-semibold">{top1?.topSubject}</p>

            <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-amber-400/20 text-xs text-amber-100 font-medium">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" /> {top1?.streak}d streak
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> {top1?.averageScore}% avg
              </span>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="order-3 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-amber-700/30 rounded-3xl p-6 text-center backdrop-blur-md relative transform md:-translate-y-1 shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-700/20 border-2 border-amber-700 flex items-center justify-center mb-3 shadow-lg shadow-amber-700/20">
              <Award className="w-7 h-7 text-amber-500" />
            </div>
            <div className="inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-700/20 text-amber-400 border border-amber-600/30 mb-2">
              3rd Place • Bronze
            </div>
            <h3 className="text-lg font-bold text-white truncate">{top3?.displayName}</h3>
            <div className="text-2xl font-black text-amber-400 my-1">{top3?.totalPoints} XP</div>
            <p className="text-xs text-slate-400 font-medium">{top3?.topSubject}</p>

            <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/5 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> {top3?.streak}d streak
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {top3?.averageScore}% avg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ranks 4+ Table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white">Full Cohort Leaderboard</h3>
            <p className="text-xs text-slate-400">Monthly cumulative score ranking</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              aria-label="Filter leaderboard by subject"
              className="bg-slate-800 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Disciplines</option>
              {ACADEMIC_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-4">Scholar</th>
                <th className="py-3 px-4">Primary Subject</th>
                <th className="py-3 px-4 text-center">Active Streak</th>
                <th className="py-3 px-4 text-center">Quizzes Done</th>
                <th className="py-3 px-4 text-right">Points Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.map((student) => {
                const isTop3 = student.rank <= 3;
                const isCurrentUser =
                  student.displayName.includes('You') || student.userId === userProfile?.userId;

                return (
                  <tr
                    key={student.userId || student.rank}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-amber-500/10 font-bold text-white'
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                          student.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : student.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : student.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {student.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{student.displayName}</span>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">{student.topSubject}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-orange-400 font-semibold">
                        <Flame className="w-3.5 h-3.5" />
                        {student.streak} days
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-slate-300">
                      {student.quizzesCompleted}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-amber-400 text-base">
                      {student.totalPoints} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* How points work card */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" />
          <span>How to Earn Monthly XP & Climb to the Top</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-slate-300 mt-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="font-bold text-amber-400 block mb-1">+100 XP</span>
            <span>Complete any topic diagnostic or practice quiz in any subject</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="font-bold text-emerald-400 block mb-1">+25 XP</span>
            <span>Bonus for each correct question answered with zero mistakes</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="font-bold text-orange-400 block mb-1">+50 XP</span>
            <span>Maintain consecutive daily learning streak across any subjects</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="font-bold text-purple-400 block mb-1">+50 XP</span>
            <span>Ask thoughtful academic doubts and engage with faculty resolutions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
