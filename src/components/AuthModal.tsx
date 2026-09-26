import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  School,
  Trophy,
  Database,
  Key,
  CheckCircle2,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { saveStoredSupabaseConfig, getStoredSupabaseConfig } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
  defaultRole = 'faculty',
}) => {
  const { loginWithEmail, signupWithEmail, loginWithGoogle, loginAsDemo, isSupabaseConnected } =
    useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Supabase Custom Config Drawer
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const currentConfig = getStoredSupabaseConfig();
  const [customUrl, setCustomUrl] = useState(currentConfig.isCustom ? currentConfig.url : '');
  const [customKey, setCustomKey] = useState(currentConfig.isCustom ? currentConfig.anonKey : '');
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password, selectedRole);
      } else {
        if (!displayName) {
          setErrorMsg(
            selectedRole === 'faculty'
              ? 'Please enter your educator name.'
              : 'Please enter your student name.'
          );
          setIsSubmitting(false);
          return;
        }
        await signupWithEmail(email, password, displayName, selectedRole);
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(
        err.message ||
          'Authentication failed. Please check credentials or use Instant Demo mode.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle(selectedRole);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        'Google OAuth via Supabase was closed or restricted. Try Email/Password or Demo mode.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim() || !customKey.trim()) {
      setErrorMsg('Both Supabase Project URL and Anon Public Key are required.');
      return;
    }
    saveStoredSupabaseConfig(customUrl, customKey);
    setConfigSavedNotice(true);
    setTimeout(() => {
      setConfigSavedNotice(false);
      setShowConfigDrawer(false);
      window.location.reload();
    }, 1200);
  };

  const handleDemoSignIn = (role: UserRole) => {
    loginAsDemo(role, 'basic');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#101426] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.25)] border border-emerald-500/30 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Supabase Badge Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Supabase Authentication</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            {mode === 'signin' ? 'Sign in to CogniTeach' : 'Create Academic Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Secure token management, instant sessions & multi-role permissions
          </p>
        </div>

        {/* Account Role Selector (Teacher vs Student) */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-center">
            Select Account Type:
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedRole('faculty')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'faculty'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Teacher / Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'student'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Student Scholar</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Supabase Custom Config Drawer Toggle */}
        {showConfigDrawer ? (
          <form
            onSubmit={handleSaveSupabaseConfig}
            className="mb-4 p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Project Settings</span>
              </span>
              <button
                type="button"
                onClick={() => setShowConfigDrawer(false)}
                className="text-slate-400 hover:text-white text-[11px]"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                Project URL (e.g. https://your-ref.supabase.co)
              </label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                Anon Public Key (JWT)
              </label>
              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>

            {configSavedNotice && (
              <div className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved! Reloading Supabase client...</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
            >
              Save Credentials & Connect
            </button>
          </form>
        ) : null}

        {/* Primary Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {selectedRole === 'faculty' ? 'Educator Full Name' : 'Student Scholar Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={
                    selectedRole === 'faculty' ? 'Prof. Rajesh Sharma' : 'Priyanshu Patel'
                  }
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'faculty'
                    ? 'teacher@academy.edu'
                    : 'student@school.edu'
                }
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'signin'
                    ? `Sign In as ${selectedRole === 'faculty' ? 'Teacher' : 'Student'}`
                    : `Create ${selectedRole === 'faculty' ? 'Teacher' : 'Student'} Account`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#101426] px-2 text-slate-400 font-bold">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button via Supabase */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google (Supabase Auth)</span>
        </button>

        {/* Quick Demo Mode Options */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <span className="block text-center text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Quick 1-Click Instant Preview
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignIn('faculty')}
              className="py-2 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <School className="w-3.5 h-3.5" />
              <span>Demo Teacher</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('student')}
              className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Demo Student</span>
            </button>
          </div>
        </div>

        {/* Footer Toggle and Supabase Config Toggle */}
        <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setErrorMsg('');
            }}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
          >
            {mode === 'signin'
              ? 'New here? Create account'
              : 'Already have an account? Sign in'}
          </button>

          <button
            type="button"
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
          >
            <Settings className="w-3 h-3 text-slate-400" />
            <span>Supabase Keys</span>
          </button>
        </div>
      </div>
    </div>
  );
};
