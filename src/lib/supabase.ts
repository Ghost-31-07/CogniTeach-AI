import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';

// Default / fallback keys for initial load
const DEFAULT_SUPABASE_URL = 'https://placeholder-project.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MjAxOTY0MzIwMH0.dummy_signature_for_sandbox_mode';

// Helper to validate URL
function isValidHttpUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Fetch active credentials from environment or localStorage
export function getStoredSupabaseConfig(): { url: string; anonKey: string; isCustom: boolean } {
  try {
    const saved = localStorage.getItem('shikshaplan_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey && isValidHttpUrl(parsed.url)) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim(), isCustom: true };
      }
    }
  } catch {
    // ignore
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && isValidHttpUrl(envUrl)) {
    return { url: envUrl.trim(), anonKey: envKey.trim(), isCustom: true };
  }

  return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY, isCustom: false };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string): void {
  try {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();
    if (isValidHttpUrl(trimmedUrl) && trimmedKey) {
      localStorage.setItem(
        'shikshaplan_supabase_config',
        JSON.stringify({ url: trimmedUrl, anonKey: trimmedKey })
      );
    }
  } catch (e) {
    console.error('Failed to save Supabase credentials:', e);
  }
}

const activeConfig = getStoredSupabaseConfig();

// Ensure safe valid URL for createClient
const safeUrl = isValidHttpUrl(activeConfig.url) ? activeConfig.url : DEFAULT_SUPABASE_URL;
const safeKey = activeConfig.anonKey || DEFAULT_SUPABASE_ANON_KEY;

// Initialize Supabase Client safely
export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export interface AppAuthUser {
  id: string;
  uid: string; // Alias for compatibility across codebase
  email: string;
  displayName: string;
  role?: 'faculty' | 'student';
  rawUser?: SupabaseUser;
}

export function mapSupabaseUserToAppUser(user: SupabaseUser | null): AppAuthUser | null {
  if (!user) return null;
  const metadata = user.user_metadata || {};
  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.displayName ||
    user.email?.split('@')[0] ||
    'Educator';

  return {
    id: user.id,
    uid: user.id,
    email: user.email || '',
    displayName: name,
    role: metadata.role || 'faculty',
    rawUser: user,
  };
}
