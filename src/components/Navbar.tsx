import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FolderHeart,
  CreditCard,
  Sun,
  Moon,
  LogOut,
  LogIn,
  Crown,
  Menu,
  X,
  Compass,
  HelpCircle,
  BarChart3,
  Trophy,
  Zap,
  GraduationCap,
  School,
  ArrowLeftRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export type AppNavView =
  | 'landing'
  | 'dashboard'
  | 'pricing'
  | 'saved'
  | 'analytics'
  | 'doubts'
  | 'practice'
  | 'leaderboard';

interface NavbarProps {
  currentView: AppNavView;
  onNavigate: (view: AppNavView) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isDark,
  onToggleTheme,
  onOpenAuth,
  savedCount = 0,
}) => {
  const { currentUser, userProfile, userRole, switchRole, logout, isDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isPro = userProfile?.planTier === 'pro';
  const genCount = userProfile?.monthlyGenerationsCount ?? 0;
  const isFaculty = userRole === 'faculty';

  const handleToggleRole = () => {
    const nextRole: UserRole = isFaculty ? 'student' : 'faculty';
    switchRole(nextRole);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-3 no-print">
      <nav className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-5 py-2.5 flex items-center justify-between transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-white/10">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                CogniTeach
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="hidden sm:block text-[9px] text-slate-400 font-medium leading-none mt-0.5">
              www.CogniTeach.com
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              currentView === 'landing'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Overview
          </button>

          {/* If Faculty: Show Curriculum Generator + Analytics; If Student: Show Practice Quiz Hub */}
          {isFaculty ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Lesson Planner
              </button>

              <button
                onClick={() => onNavigate('analytics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  currentView === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                Student Progress & Mistakes
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('practice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                currentView === 'practice'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Practice Quizzes (All Subjects)
            </button>
          )}

          {/* Doubts Desk (Both) */}
          <button
            onClick={() => onNavigate('doubts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              currentView === 'doubts'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            {isFaculty ? 'Doubts Desk' : 'Ask a Doubt'}
          </button>

          {/* Monthly Leaderboard (Both) */}
          <button
            onClick={() => onNavigate('leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              currentView === 'leaderboard'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Leaderboard
          </button>

          {isFaculty && currentUser && (
            <button
              onClick={() => onNavigate('saved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 relative ${
                currentView === 'saved'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderHeart className="w-3.5 h-3.5" />
              Saved Plans
              {savedCount > 0 && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-400 text-slate-950 font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => onNavigate('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              currentView === 'pricing'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Pricing
            {isPro && (
              <span className="text-[10px] text-amber-300 font-bold flex items-center">
                <Crown className="w-2.5 h-2.5 inline" /> PRO
              </span>
            )}
          </button>
        </div>

        {/* Right Section: Role Switcher Pill + Theme Toggle + User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Role Switcher Pill (Critical for Multi-Account Demo) */}
          <button
            onClick={handleToggleRole}
            title={`Currently in ${isFaculty ? 'Faculty' : 'Student'} mode. Click to switch to ${
              isFaculty ? 'Student' : 'Faculty'
            } mode.`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all shadow-sm ${
              isFaculty
                ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            {isFaculty ? (
              <>
                <School className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Faculty Account</span>
                <span className="sm:hidden">Faculty</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Student Account</span>
                <span className="sm:hidden">Student</span>
              </>
            )}
            <ArrowLeftRight className="w-3 h-3 text-slate-400 ml-0.5 opacity-70" />
          </button>

          {/* Theme switch */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Dark / Light Theme"
            className="p-2 rounded-xl border border-white/10 bg-slate-900/40 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User state */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/10 bg-slate-900/70 hover:bg-slate-800 transition-all text-xs text-slate-200"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-white text-[11px] ${
                    isFaculty
                      ? 'bg-gradient-to-r from-violet-500 to-indigo-500'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  }`}
                >
                  {userProfile?.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-semibold truncate max-w-[110px]">
                    {userProfile?.displayName || currentUser.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isFaculty ? 'Teacher' : `${userProfile?.studentPoints || 780} XP`}
                  </div>
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-2xl glass-panel p-2 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-2 bg-slate-900/95"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-xs font-semibold text-white truncate">
                      {userProfile?.displayName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isFaculty
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isFaculty ? 'Faculty Role' : 'Student Role'}
                      </span>
                      {isDemoUser && (
                        <span className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded">
                          Demo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Switch Role Quick Button in Dropdown */}
                  <button
                    onClick={() => {
                      handleToggleRole();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 transition-colors mb-1"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
                      Switch to {isFaculty ? 'Student Account' : 'Faculty Account'}
                    </span>
                  </button>

                  {isFaculty && (
                    <div className="px-3 py-2 text-xs text-slate-300 bg-white/5 rounded-lg mb-2">
                      <div className="flex justify-between items-center">
                        <span>Lesson Quota:</span>
                        <span className="font-bold text-white">
                          {isPro ? 'Unlimited' : `${genCount} / 3`}
                        </span>
                      </div>
                      {!isPro && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('pricing');
                          }}
                          className="mt-2 w-full text-center py-1 text-[11px] font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md hover:brightness-110"
                        >
                          Upgrade to Pro ($9.99/mo)
                        </button>
                      )}
                    </div>
                  )}

                  {!isFaculty && (
                    <div className="px-3 py-2 text-xs text-slate-300 bg-amber-500/10 rounded-lg mb-2 border border-amber-500/20">
                      <div className="flex justify-between items-center text-amber-300 font-bold">
                        <span>Total Monthly XP:</span>
                        <span>{userProfile?.studentPoints || 780} XP</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        🔥 {userProfile?.studentStreak || 7}-day study streak
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-500/10 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="lg:hidden p-2 rounded-xl border border-white/10 bg-slate-900/40 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 glass-panel rounded-2xl p-4 flex flex-col gap-2 shadow-2xl border border-white/10 bg-slate-900/95">
          {/* Quick Role switch button */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 mb-1">
            <span className="text-xs text-slate-300">Active View:</span>
            <button
              onClick={() => {
                handleToggleRole();
                setMobileMenuOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white"
            >
              Switch to {isFaculty ? 'Student' : 'Faculty'}
            </button>
          </div>

          <button
            onClick={() => {
              onNavigate('landing');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/5"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            Overview
          </button>

          {isFaculty ? (
            <>
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/5"
              >
                <BookOpen className="w-4 h-4 text-violet-400" />
                Lesson Planner
              </button>
              <button
                onClick={() => {
                  onNavigate('analytics');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/5"
              >
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Student Progress & Mistakes
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onNavigate('practice');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/5"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Practice Quizzes (All Subjects)
            </button>
          )}

          <button
            onClick={() => {
              onNavigate('doubts');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/5"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            {isFaculty ? 'Doubts Desk' : 'Ask a Doubt'}
          </button>

          <button
            onClick={() => {
              onNavigate('leaderboard');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/5"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Monthly Leaderboard
          </button>

          {isFaculty && currentUser && (
            <button
              onClick={() => {
                onNavigate('saved');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/5"
            >
              <FolderHeart className="w-4 h-4 text-pink-400" />
              Saved Plans ({savedCount})
            </button>
          )}

          <button
            onClick={() => {
              onNavigate('pricing');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/5"
          >
            <CreditCard className="w-4 h-4 text-cyan-400" />
            Pricing & Upgrade
          </button>
        </div>
      )}
    </header>
  );
};
