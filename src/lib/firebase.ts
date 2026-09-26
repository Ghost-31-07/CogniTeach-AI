import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  getDocFromServer,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };
import {
  UserProfile,
  UserRole,
  SavedPlanItem,
  DoubtItem,
  StudentProgressRecord,
  MonthlyLeaderboardEntry,
} from '../types';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Must pass firebaseConfig.firestoreDatabaseId per AI Studio guidelines
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Error Handling conforming to Firebase Skill requirements
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo?: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per Firebase skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: Client is offline or initializing.');
    }
  }
}
testConnection();

// User Profile Helpers (Decoupled from Firebase Auth, works with Supabase Auth users)
export async function getOrCreateUserProfile(
  user: { id?: string; uid?: string; email?: string | null; displayName?: string | null },
  preferredRole: UserRole = 'faculty'
): Promise<UserProfile> {
  const targetUserId = user.id || user.uid || 'usr_anonymous';
  const userRef = doc(db, 'users', targetUserId);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      // Ensure role exists
      if (!data.role) {
        data.role = preferredRole;
        await updateDoc(userRef, { role: preferredRole });
      }
      return data;
    }

    const now = new Date().toISOString();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const newProfile: UserProfile = {
      userId: targetUserId,
      email: user.email || 'educator@shikshaplan.ai',
      displayName: user.displayName || user.email?.split('@')[0] || (preferredRole === 'faculty' ? 'Prof. Rajesh Sharma' : 'Priyanshu Patel'),
      role: preferredRole,
      planTier: 'basic',
      monthlyGenerationsCount: 0,
      billingCycleResetDate: nextMonth.toISOString(),
      studentPoints: preferredRole === 'student' ? 350 : 0,
      studentStreak: preferredRole === 'student' ? 4 : 0,
      quizzesCompleted: preferredRole === 'student' ? 2 : 0,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${targetUserId}`);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      role,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    throw error;
  }
}

export async function updateUserPlanTier(userId: string, tier: 'basic' | 'pro', subId?: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  try {
    const updateData: Partial<UserProfile> = {
      planTier: tier,
      updatedAt: new Date().toISOString(),
    };
    if (subId) {
      updateData.stripeSubscriptionId = subId;
    }
    await updateDoc(userRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    throw error;
  }
}

export async function incrementUserGenerations(userId: string, currentCount: number): Promise<number> {
  const userRef = doc(db, 'users', userId);
  const newCount = currentCount + 1;
  try {
    await updateDoc(userRef, {
      monthlyGenerationsCount: newCount,
      updatedAt: new Date().toISOString(),
    });
    return newCount;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    throw error;
  }
}

// Lesson Plan Database Helpers
export async function saveLessonPlanToFirestore(
  userId: string,
  plan: Omit<SavedPlanItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<SavedPlanItem> {
  const planId = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const planRef = doc(db, 'users', userId, 'lessonPlans', planId);
  const now = new Date().toISOString();

  const fullPlan: SavedPlanItem = {
    id: planId,
    userId,
    ...plan,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(planRef, fullPlan);
    return fullPlan;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${userId}/lessonPlans/${planId}`);
    throw error;
  }
}

export async function fetchUserLessonPlans(userId: string): Promise<SavedPlanItem[]> {
  const colRef = collection(db, 'users', userId, 'lessonPlans');
  try {
    const snap = await getDocs(colRef);
    const plans: SavedPlanItem[] = [];
    snap.forEach((d) => {
      plans.push(d.data() as SavedPlanItem);
    });
    return plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/lessonPlans`);
    throw error;
  }
}

export async function deleteLessonPlanFromFirestore(userId: string, planId: string): Promise<void> {
  const planRef = doc(db, 'users', userId, 'lessonPlans', planId);
  try {
    await deleteDoc(planRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}/lessonPlans/${planId}`);
    throw error;
  }
}

// ==========================================
// DOUBTS & QUESTIONS HELPERS (Multi-Subject)
// ==========================================

export async function saveDoubtToFirestore(doubtData: {
  studentId: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  topic: string;
  question: string;
}): Promise<DoubtItem> {
  const doubtId = `doubt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const doubtRef = doc(db, 'doubts', doubtId);
  const now = new Date().toISOString();

  const newDoubt: DoubtItem = {
    id: doubtId,
    studentId: doubtData.studentId,
    studentName: doubtData.studentName,
    studentEmail: doubtData.studentEmail,
    subject: doubtData.subject,
    topic: doubtData.topic,
    question: doubtData.question,
    status: 'open',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doubtRef, newDoubt);
    return newDoubt;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `doubts/${doubtId}`);
    throw error;
  }
}

export async function fetchDoubtsFromFirestore(): Promise<DoubtItem[]> {
  const colRef = collection(db, 'doubts');
  try {
    const snap = await getDocs(colRef);
    const doubts: DoubtItem[] = [];
    snap.forEach((d) => {
      doubts.push(d.data() as DoubtItem);
    });
    return doubts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'doubts');
    throw error;
  }
}

export async function updateDoubtAnswerInFirestore(
  doubtId: string,
  teacherResponse: string,
  teacherName: string,
  teacherId: string,
  newStatus: 'answered' | 'resolved' = 'answered'
): Promise<void> {
  const doubtRef = doc(db, 'doubts', doubtId);
  try {
    await updateDoc(doubtRef, {
      teacherResponse,
      teacherName,
      teacherId,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `doubts/${doubtId}`);
    throw error;
  }
}

export async function resolveDoubtInFirestore(doubtId: string): Promise<void> {
  const doubtRef = doc(db, 'doubts', doubtId);
  try {
    await updateDoc(doubtRef, {
      status: 'resolved',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `doubts/${doubtId}`);
    throw error;
  }
}

// ==========================================
// STUDENT PROGRESS & MISTAKE ANALYTICS HELPERS
// ==========================================

export async function saveStudentProgressToFirestore(
  progressData: Omit<StudentProgressRecord, 'id' | 'createdAt'>
): Promise<StudentProgressRecord> {
  const progressId = `prog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const progressRef = doc(db, 'progress', progressId);
  const now = new Date().toISOString();

  const record: StudentProgressRecord = {
    id: progressId,
    ...progressData,
    createdAt: now,
  };

  // Prepare payload for Firestore
  const firestorePayload = {
    id: progressId,
    studentId: progressData.studentId,
    studentName: progressData.studentName,
    studentEmail: progressData.studentEmail,
    subject: progressData.subject,
    topic: progressData.topic,
    score: progressData.score,
    totalQuestions: progressData.totalQuestions,
    percentage: progressData.percentage,
    understandingLevel: progressData.understandingLevel,
    pointsEarned: progressData.pointsEarned,
    answersJson: JSON.stringify(progressData.answers),
    createdAt: now,
  };

  try {
    await setDoc(progressRef, firestorePayload);

    // Also update student's cumulative points and streak in user profile
    try {
      const userRef = doc(db, 'users', progressData.studentId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const u = userSnap.data() as UserProfile;
        const updatedPoints = (u.studentPoints || 0) + progressData.pointsEarned;
        const updatedQuizzes = (u.quizzesCompleted || 0) + 1;
        await updateDoc(userRef, {
          studentPoints: updatedPoints,
          quizzesCompleted: updatedQuizzes,
          studentStreak: (u.studentStreak || 0) + 1,
          updatedAt: now,
        });
      }
    } catch (e) {
      console.warn('Could not increment user points on user profile:', e);
    }

    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `progress/${progressId}`);
    throw error;
  }
}

export async function fetchStudentProgressFromFirestore(): Promise<StudentProgressRecord[]> {
  const colRef = collection(db, 'progress');
  try {
    const snap = await getDocs(colRef);
    const records: StudentProgressRecord[] = [];
    snap.forEach((d) => {
      const data = d.data();
      let answersParsed = [];
      try {
        answersParsed = typeof data.answersJson === 'string' ? JSON.parse(data.answersJson) : (data.answers || []);
      } catch {
        answersParsed = [];
      }

      records.push({
        id: data.id || d.id,
        studentId: data.studentId,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        subject: data.subject || 'General Education',
        topic: data.topic,
        score: data.score,
        totalQuestions: data.totalQuestions,
        percentage: data.percentage,
        understandingLevel: data.understandingLevel,
        pointsEarned: data.pointsEarned || 100,
        answers: answersParsed,
        createdAt: data.createdAt,
      });
    });
    return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'progress');
    throw error;
  }
}

// ==========================================
// MONTHLY LEADERBOARD AGGREGATOR
// ==========================================

export async function fetchMonthlyLeaderboardFromFirestore(): Promise<MonthlyLeaderboardEntry[]> {
  try {
    const usersRef = collection(db, 'users');
    const snap = await getDocs(usersRef);
    const studentEntries: MonthlyLeaderboardEntry[] = [];

    const now = new Date();
    const currentMonthYear = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;

    snap.forEach((d) => {
      const u = d.data() as UserProfile;
      if (u.role === 'student' || u.studentPoints) {
        studentEntries.push({
          userId: u.userId,
          displayName: u.displayName || 'Scholar',
          avatarSeed: u.userId,
          monthYear: currentMonthYear,
          totalPoints: u.studentPoints || 150,
          quizzesCompleted: u.quizzesCompleted || 1,
          averageScore: 84,
          streak: u.studentStreak || 3,
          topSubject: 'Physics & STEM',
          rank: 0,
          badges: ['Mastery Explorer', 'Active Inquirer'],
        });
      }
    });

    // If no students in DB yet, supply realistic demo cohort so the leaderboard is immediately lively and motivating!
    if (studentEntries.length === 0) {
      return getDemoLeaderboard();
    }

    studentEntries.sort((a, b) => b.totalPoints - a.totalPoints);
    return studentEntries.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));
  } catch (error) {
    console.warn('Could not fetch leaderboard directly from firestore, returning seeded leaderboard:', error);
    return getDemoLeaderboard();
  }
}

export function getDemoLeaderboard(): MonthlyLeaderboardEntry[] {
  const now = new Date();
  const currentMonthYear = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;

  return [
    {
      userId: 'student_1',
      displayName: 'Aarav Sharma',
      monthYear: currentMonthYear,
      totalPoints: 1280,
      quizzesCompleted: 15,
      averageScore: 96,
      streak: 21,
      topSubject: 'Physics & Mechanics',
      rank: 1,
      badges: ['Physics Maestro', '21-Day Streak', 'Zero-Error Streak'],
    },
    {
      userId: 'student_2',
      displayName: 'Ananya Iyer',
      monthYear: currentMonthYear,
      totalPoints: 1140,
      quizzesCompleted: 13,
      averageScore: 93,
      streak: 15,
      topSubject: 'Mathematics & Calculus',
      rank: 2,
      badges: ['Math Olympian', 'Top Inquirer'],
    },
    {
      userId: 'student_3',
      displayName: 'Rohan Verma',
      monthYear: currentMonthYear,
      totalPoints: 1020,
      quizzesCompleted: 11,
      averageScore: 90,
      streak: 11,
      topSubject: 'Computer Science & AI',
      rank: 3,
      badges: ['Algorithm Ace', 'Consistent Scholar'],
    },
    {
      userId: 'student_4',
      displayName: 'Priyanshu Patel (You)',
      monthYear: currentMonthYear,
      totalPoints: 880,
      quizzesCompleted: 9,
      averageScore: 88,
      streak: 8,
      topSubject: 'Chemistry & Organic Science',
      rank: 4,
      badges: ['Rapid Climber', 'Doubt Solver', 'High Curiosity'],
    },
    {
      userId: 'student_5',
      displayName: 'Diya Sengupta',
      monthYear: currentMonthYear,
      totalPoints: 760,
      quizzesCompleted: 8,
      averageScore: 85,
      streak: 6,
      topSubject: 'History & Social Studies',
      rank: 5,
      badges: ['History Scholar'],
    },
    {
      userId: 'student_6',
      displayName: 'Aditya Kulkarni',
      monthYear: currentMonthYear,
      totalPoints: 650,
      quizzesCompleted: 7,
      averageScore: 82,
      streak: 5,
      topSubject: 'Economics & Business',
      rank: 6,
      badges: ['Market Strategist'],
    },
    {
      userId: 'student_7',
      displayName: 'Meera Nambiar',
      monthYear: currentMonthYear,
      totalPoints: 580,
      quizzesCompleted: 6,
      averageScore: 81,
      streak: 4,
      topSubject: 'Biology & Life Sciences',
      rank: 7,
      badges: ['Bio Explorer'],
    },
    {
      userId: 'student_8',
      displayName: 'Ishaan Gupta',
      monthYear: currentMonthYear,
      totalPoints: 490,
      quizzesCompleted: 5,
      averageScore: 79,
      streak: 3,
      topSubject: 'Environmental Science',
      rank: 8,
      badges: ['Eco Champion'],
    },
  ];
}
