export type UserRole = 'faculty' | 'student';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
  planTier: 'basic' | 'pro';
  monthlyGenerationsCount: number;
  billingCycleResetDate: string;
  studentPoints?: number;
  studentStreak?: number;
  quizzesCompleted?: number;
  studentGradeLevel?: string;
  facultySubject?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonPlanTimelineStep {
  phase: string;
  durationMinutes: number;
  description: string;
  teacherGuidance: string;
  studentActivity: string;
}

export interface LessonPlanSection {
  title: string;
  overview: string;
  learningObjectives: string[];
  materialsNeeded: string[];
  standardsAligned: string[];
  timeline: LessonPlanTimelineStep[];
  differentiation: {
    advancedLearners: string;
    supportLearners: string;
    eslSupport: string;
  };
  assessment: string;
  exitTicket: string;
}

export interface WorksheetQuestion {
  questionNumber: number;
  prompt: string;
  type: 'open_ended' | 'fill_in_blank' | 'multiple_choice';
  choices?: string[];
  scaffoldLines?: number;
  sampleAnswer?: string;
}

export interface WorksheetSection {
  heading: string;
  subtext?: string;
  items: WorksheetQuestion[];
}

export interface PrintableWorksheet {
  title: string;
  gradeLevel: string;
  instructions: string;
  sections: WorksheetSection[];
  criticalThinkingChallenge: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AnswerKeyItem {
  questionId: number;
  correctOption: string;
  reason: string;
}

export interface LessonQuiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
  answerKeySummary: AnswerKeyItem[];
}

export interface DiagnosticQuestion {
  id: number;
  question: string;
  conceptTested: string;
  bloomLevel?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  misconceptions?: string[];
}

export interface UnderstandingProfile {
  assessedLevel: 'beginner' | 'developing' | 'proficient' | 'advanced' | 'mixed';
  scorePercentage?: number;
  diagnosticSummary: string;
  targetedMisconceptions: string[];
  adaptedTeachingStrategy: string;
  recommendedPacing: string;
}

export interface GeneratedLessonPackage {
  topic: string;
  gradeLevel: string;
  duration: string;
  subject?: string;
  understandingProfile?: UnderstandingProfile;
  lessonPlan: LessonPlanSection;
  worksheet: PrintableWorksheet;
  quiz: LessonQuiz;
  markdown: {
    lessonPlanMd: string;
    worksheetMd: string;
    quizMd: string;
  };
}

export interface SavedPlanItem {
  id: string;
  userId: string;
  topic: string;
  gradeLevel: string;
  duration: string;
  subject?: string;
  lessonPlanMarkdown: string;
  worksheetMarkdown: string;
  quizJson: string;
  createdAt: string;
  updatedAt: string;
}

// Doubts / Questions System
export interface DoubtItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  topic: string;
  question: string;
  status: 'open' | 'answered' | 'resolved';
  teacherResponse?: string;
  teacherName?: string;
  teacherId?: string;
  createdAt: string;
  updatedAt: string;
}

// Student Answer & Mistake Evaluation
export interface QuestionMistakeAnalysis {
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  conceptTested?: string;
  mistakeType?: string; // e.g. "Misconception: Inverse vs Proportional", "Calculation Slip", "Incomplete Vocabulary"
  mistakeExplanation?: string;
  remediationTip?: string;
}

export interface StudentProgressRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  understandingLevel: 'beginner' | 'developing' | 'proficient' | 'advanced';
  pointsEarned: number;
  answers: QuestionMistakeAnalysis[];
  createdAt: string;
}

// Monthly Leaderboard
export interface MonthlyLeaderboardEntry {
  userId: string;
  displayName: string;
  avatarSeed?: string;
  monthYear: string;
  totalPoints: number;
  quizzesCompleted: number;
  averageScore: number;
  streak: number;
  topSubject: string;
  rank: number;
  badges: string[];
}

export const ACADEMIC_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology & Life Sciences',
  'Computer Science & AI',
  'History & Social Studies',
  'Literature & English Language',
  'Economics & Business',
  'Environmental Science & Geography',
  'Foreign Languages',
  'Psychology & Philosophy',
  'Arts & Music Theory',
] as const;

export type AcademicSubject = (typeof ACADEMIC_SUBJECTS)[number];
