export interface Option {
  key: "A" | "B" | "C" | "D" | "E";
  text: string;
}

export interface Question {
  id: number;
  stem: string;
  options: Option[];
  correctKey: "A" | "B" | "C" | "D" | "E";
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  answers: { [questionId: number]: "A" | "B" | "C" | "D" | "E" | null };
  mode: "quiz" | "practice";
}

export interface QuizStatistics {
  completedAttempts: number;
  bestScorePercentage: number;
  averageScorePercentage: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  streakCount: number; // consecutive correct answers in practice or total correct sessions
  missedQuestionsList: number[]; // question IDs frequently answered incorrectly
}
