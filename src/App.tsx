import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, AppNavView } from './components/Navbar';
import { AntigravityBackground } from './components/AntigravityBackground';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { PricingView } from './components/PricingView';
import { SavedPlansView } from './components/SavedPlansView';
import { AuthModal } from './components/AuthModal';
import { PrintableView } from './components/PrintableView';
import { StudentDoubtsHub } from './components/StudentDoubtsHub';
import { TeacherAnalyticsView } from './components/TeacherAnalyticsView';
import { MonthlyLeaderboardView } from './components/MonthlyLeaderboardView';
import { StudentPracticeHub } from './components/StudentPracticeHub';
import { GeneratedLessonPackage, SavedPlanItem, UserRole } from './types';
import { fetchUserLessonPlans } from './lib/firebase';

function MainApp() {
  const { currentUser, userProfile, userRole, isDemoUser } = useAuth();

  // Navigation & Theme
  const [currentView, setCurrentView] = useState<AppNavView>('landing');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'signin' | 'signup'>('signin');
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('faculty');

  // Active Printable Plan
  const [activePrintPlan, setActivePrintPlan] = useState<GeneratedLessonPackage | null>(null);

  // Saved Plans
  const [savedPlans, setSavedPlans] = useState<SavedPlanItem[]>([]);

  // Apply dark/light class to root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDark]);

  // Load saved plans on auth
  useEffect(() => {
    if (currentUser) {
      if (!isDemoUser) {
        fetchUserLessonPlans(currentUser.uid)
          .then((plans) => setSavedPlans(plans))
          .catch((err) => console.warn('Could not fetch saved plans from firestore:', err));
      }
    } else {
      setSavedPlans([]);
    }
  }, [currentUser, isDemoUser]);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin', role: UserRole = 'faculty') => {
    setAuthDefaultMode(mode);
    setAuthDefaultRole(role);
    setAuthModalOpen(true);
  };

  const handleQuickTryFromLanding = (topic: string) => {
    if (userRole === 'student') {
      setCurrentView('practice');
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative select-text">
      {/* Background with floating antigravity physics */}
      <AntigravityBackground isDark={isDark} />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenAuth={() => handleOpenAuth('signin', userRole)}
        savedCount={savedPlans.length}
      />

      {/* Main View Router */}
      <main className="flex-1 relative z-10 pb-12">
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => {
              if (currentUser) {
                setCurrentView(userRole === 'student' ? 'practice' : 'dashboard');
              } else {
                handleOpenAuth('signup', 'faculty');
              }
            }}
            onNavigatePricing={() => setCurrentView('pricing')}
            onQuickTry={handleQuickTryFromLanding}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            onNavigatePricing={() => setCurrentView('pricing')}
            onNavigateSaved={() => setCurrentView('saved')}
            onOpenAuth={() => handleOpenAuth('signin', 'faculty')}
            onTriggerPrint={(plan) => setActivePrintPlan(plan)}
            savedPlans={savedPlans}
            setSavedPlans={setSavedPlans}
          />
        )}

        {currentView === 'analytics' && <TeacherAnalyticsView />}

        {currentView === 'doubts' && <StudentDoubtsHub />}

        {currentView === 'practice' && (
          <StudentPracticeHub
            onNavigateDoubts={() => setCurrentView('doubts')}
            onNavigateLeaderboard={() => setCurrentView('leaderboard')}
          />
        )}

        {currentView === 'leaderboard' && (
          <MonthlyLeaderboardView onNavigatePractice={() => setCurrentView('practice')} />
        )}

        {currentView === 'pricing' && (
          <PricingView
            onOpenAuth={() => handleOpenAuth('signup', 'faculty')}
            onNavigateDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'saved' && (
          <SavedPlansView
            savedPlans={savedPlans}
            setSavedPlans={setSavedPlans}
            onOpenPlan={(plan) => setActivePrintPlan(plan)}
            onTriggerPrint={(plan) => setActivePrintPlan(plan)}
            onNavigateDashboard={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-4 border-t border-white/5 relative z-10 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} EDUPlan AI. Unified Multi-Role Academic Platform.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <span>Faculty Curricula & Formative Analytics</span>
            <span>•</span>
            <span>All-Subject Student Practice & Doubts Desk</span>
            <span>•</span>
            <span>Monthly Excellence Leaderboard</span>
          </div>
        </div>
      </footer>

      {/* Floating Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authDefaultMode}
        defaultRole={authDefaultRole}
      />

      {/* Print & PDF Modal */}
      {activePrintPlan && (
        <PrintableView lessonData={activePrintPlan} onClose={() => setActivePrintPlan(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
