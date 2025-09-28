export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeText: string;
  score: number;
  summary: string;
  answers: Answer[];
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface Answer {
  questionId: number;
  question: string;
  answer: string;
  timeSpent: number;
  maxTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
}

export interface Question {
  id: number;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

export interface InterviewState {
  currentCandidate: Candidate | null;
  currentQuestionIndex: number;
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
}

export interface AppState {
  candidates: Candidate[];
  interview: InterviewState;
  activeTab: 'interviewee' | 'interviewer';
}