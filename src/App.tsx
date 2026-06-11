import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Clock,
  Trophy,
  Flame,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Home,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Eye,
  Star
} from "lucide-react";
import { QUESTION_BANK } from "./data";
import { QuizCard } from "./components/QuizCard";
import { QuizAttempt, QuizStatistics } from "./types";

export default function App() {
  // App state
  const [appState, setAppState] = useState<"welcome" | "quiz" | "results">("welcome");
  const [quizMode, setQuizMode] = useState<"quiz" | "practice">("quiz");
  
  // Quiz progress states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: "A" | "B" | "C" | "D" | "E" | null }>({});
  const [bookmarked, setBookmarked] = useState<{ [key: number]: boolean }>({});
  
  // Timer states
  const [timer, setTimer] = useState<number>(0);
  const [timerIntervalId, setTimerIntervalId] = useState<number | null>(null);




  const [questionTimeLimit] = useState<number>(25);
const [questionTimeRemaining, setQuestionTimeRemaining] = useState<number>(25);







  
  // Sync state values to refs to avoid stale closures in interval callbacks
  const userAnswersRef = useRef(userAnswers);
  const timerRef = useRef(timer);
  const quizModeRef = useRef(quizMode);
  const currentQuestionIdxRef = useRef(currentQuestionIndex);
  const questionTimeLimitRef = useRef(questionTimeLimit);

  useEffect(() => {
    userAnswersRef.current = userAnswers;
  }, [userAnswers]);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    quizModeRef.current = quizMode;
  }, [quizMode]);

  useEffect(() => {
    currentQuestionIdxRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  useEffect(() => {
    questionTimeLimitRef.current = questionTimeLimit;
  }, [questionTimeLimit]);

  // Search/Navigation Filter state
  const [filterType, setFilterType] = useState<"all" | "answered" | "unanswered" | "bookmarked">("all");
  const [viewStyle, setViewStyle] = useState<"focus" | "list">("focus");

  // History/Statistics state
  const [stats, setStats] = useState<QuizStatistics>({
    completedAttempts: 0,
    bestScorePercentage: 0,
    averageScorePercentage: 0,
    totalQuestionsAnswered: 0,
    correctAnswersCount: 0,
    streakCount: 0,
    missedQuestionsList: []
  });

  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  // Scroll to active question ref
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Fetch or setup history on load
  useEffect(() => {
    const rawAttempts = localStorage.getItem("sentence_completion_quiz_attempts");
    if (rawAttempts) {
      try {
        const attempts: QuizAttempt[] = JSON.parse(rawAttempts);
        recalculateStatistics(attempts);
      } catch (e) {
        console.error("Error reading local storage statistics", e);
      }
    }
  }, []);

  // Timer run effect (overall test timer)
  useEffect(() => {
    if (appState === "quiz") {
      const interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setTimerIntervalId(interval);
      return () => {
        window.clearInterval(interval);
      };
    } else {
      if (timerIntervalId) {
        window.clearInterval(timerIntervalId);
        setTimerIntervalId(null);
      }
    }
  }, [appState]);

  // Question Per-Item Timer Effect (counts down and auto-advances the question)
  useEffect(() => {
    if (appState !== "quiz") return;

    // Reset remaining time to the configured limit on question change
    setQuestionTimeRemaining(questionTimeLimit);

    const interval = window.setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev <= 1) {
          const idx = currentQuestionIdxRef.current;
          const totalQ = QUESTION_BANK.length;
          
          if (idx < totalQ - 1) {
            // Auto-advance to the next question
            setCurrentQuestionIndex(idx + 1);
          } else {
            // Out of questions, automatically submit the quiz
            submitQuizAnswers();
          }
          return questionTimeLimitRef.current;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [currentQuestionIndex, appState, questionTimeLimit]);

  // Recalculate local stats helper
  const recalculateStatistics = (attempts: QuizAttempt[]) => {
    if (attempts.length === 0) return;

    let bestScoreDecimal = 0;
    let totalScoreSumDecimal = 0;
    let totalQuestionsCount = 0;
    let totalCorrectCount = 0;

    // Track missed questions
    const missedFrequency: { [key: number]: number } = {};

    attempts.forEach((attempt) => {
      const percentage = (attempt.score / attempt.totalQuestions) * 100;
      if (percentage > bestScoreDecimal) {
        bestScoreDecimal = percentage;
      }
      totalScoreSumDecimal += percentage;
      totalQuestionsCount += attempt.totalQuestions;
      totalCorrectCount += attempt.score;

      // Log incorrect questions
      Object.entries(attempt.answers).forEach(([qIdStr, optKey]) => {
        const qId = parseInt(qIdStr);
        const question = QUESTION_BANK.find((q) => q.id === qId);
        if (question && optKey !== question.correctKey) {
          missedFrequency[qId] = (missedFrequency[qId] || 0) + 1;
        }
      });
    });

    // Sort to find most frequently missed
    const missedSorted = Object.entries(missedFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([qId]) => parseInt(qId))
      .slice(0, 5);

    // Calculate streak of latest consecutive sessions where score >= 70%
    let currentStreak = 0;
    const sortedAttempts = [...attempts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const att of sortedAttempts) {
      if ((att.score / att.totalQuestions) >= 0.7) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStats({
      completedAttempts: attempts.length,
      bestScorePercentage: Math.round(bestScoreDecimal),
      averageScorePercentage: Math.round(totalScoreSumDecimal / attempts.length),
      totalQuestionsAnswered: totalQuestionsCount,
      correctAnswersCount: totalCorrectCount,
      streakCount: currentStreak,
      missedQuestionsList: missedSorted
    });

    if (attempts.length > 0) {
      setLastAttempt(sortedAttempts[0]);
    }
  };

  // Action methods
  const startQuiz = (mode: "quiz" | "practice") => {
    setQuizMode(mode);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setBookmarked({});
    setTimer(0);
    setQuestionTimeRemaining(questionTimeLimit);
    setAppState("quiz");
  };

  const handleSelectOption = (questionId: number, optionKey: "A" | "B" | "C" | "D" | "E") => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));

    // In quiz mode, autoadvance to the next question if it is one-by-one focus view.
    if (quizMode === "quiz" && viewStyle === "focus" && currentQuestionIndex < QUESTION_BANK.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 350);
    }
  };

  const toggleBookmark = (questionId: number) => {
    setBookmarked((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const submitQuizAnswers = () => {
    const currentAnswers = userAnswersRef.current;
    const currentTimerVal = timerRef.current;
    const currentMode = quizModeRef.current;

    let correctCount = 0;
    QUESTION_BANK.forEach((q) => {
      if (currentAnswers[q.id] === q.correctKey) {
        correctCount++;
      }
    });

    const newAttempt: QuizAttempt = {
      id: "attempt-" + Date.now(),
      date: new Date().toISOString(),
      score: correctCount,
      totalQuestions: QUESTION_BANK.length,
      timeSpentSeconds: currentTimerVal,
      answers: currentAnswers,
      mode: currentMode
    };

    const currentListStr = localStorage.getItem("sentence_completion_quiz_attempts");
    let currentList: QuizAttempt[] = [];
    if (currentListStr) {
      try {
        currentList = JSON.parse(currentListStr);
      } catch (e) {
        currentList = [];
      }
    }
    
    currentList.push(newAttempt);
    localStorage.setItem("sentence_completion_quiz_attempts", JSON.stringify(currentList));
    
    recalculateStatistics(currentList);
    setAppState("results");
  };

  const handleResetHistory = () => {
    if (confirm("Are you sure you want to reset all your score history? This action is permanent.")) {
      localStorage.removeItem("sentence_completion_quiz_attempts");
      setStats({
        completedAttempts: 0,
        bestScorePercentage: 0,
        averageScorePercentage: 0,
        totalQuestionsAnswered: 0,
        correctAnswersCount: 0,
        streakCount: 0,
        missedQuestionsList: []
      });
      setLastAttempt(null);
    }
  };

  // Formatted Timer string
  const getFormattedTime = (secondsCount: number) => {
    const mins = Math.floor(secondsCount / 60);
    const secs = secondsCount % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Answer status checks
  const answeredCount = Object.keys(userAnswers).filter((k) => userAnswers[parseInt(k)] !== undefined && userAnswers[parseInt(k)] !== null).length;
  const unansweredCount = QUESTION_BANK.length - answeredCount;

  // Filtered lists for jump-navigation
  const getFilteredQuestions = () => {
    return QUESTION_BANK.filter((q) => {
      const ans = userAnswers[q.id];
      const hasAnswered = ans !== undefined && ans !== null;
      const isBookmarked = bookmarked[q.id] === true;

      if (filterType === "answered") return hasAnswered;
      if (filterType === "unanswered") return !hasAnswered;
      if (filterType === "bookmarked") return isBookmarked;
      return true;
    });
  };

  const filteredQuestions = getFilteredQuestions();

  // Jump helper
  const handleJumpToQuestion = (id: number) => {
    const index = QUESTION_BANK.findIndex((q) => q.id === id);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      if (viewStyle === "list") {
        setTimeout(() => {
          questionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  };

  // Grade descriptor helper
  const getGradeDescriptor = (scorePercentage: number) => {
    if (scorePercentage >= 90) return { label: "Mastery Distinction", text: "Stellar! You have flawless grammar and logical intuition.", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" };
    if (scorePercentage >= 75) return { label: "Excellent Pass", text: "Very impressive vocabulary and precise structural complete logic.", color: "text-indigo-300 bg-indigo-500/10 border-indigo-500/30" };
    if (scorePercentage >= 50) return { label: "Pass Standard", text: "Good understanding of context clues. Review missed items for mastery.", color: "text-amber-300 bg-amber-500/10 border-amber-500/30" };
    return { label: "Needs Focused Revision", text: "Requires deeper practice with transition markers like 'Although', 'Despite', and contrast clauses.", color: "text-rose-300 bg-rose-500/10 border-rose-500/30" };
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white selection:bg-indigo-500/30 selection:text-white relative overflow-x-hidden font-sans pb-12" id="main-container">
      {/* Dynamic Background Blur Blobs */}
      <div className="absolute top-[-100px] left-[-50px] w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-[-100px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[200px] left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Dynamic Upper Top Bar */}
      <header className="border-b border-white/10 bg-white/[0.03] sticky top-0 z-40 backdrop-blur-xl" id="header-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppState("welcome")} id="logo-action">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-350 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Brain id="header-logo" className="w-5.5 h-5.5 text-indigo-300" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-base leading-tight tracking-tight text-white sm:text-lg">
                Sentence Completion Quiz
              </h1>
              <p className="font-mono text-[10px] uppercase font-semibold tracking-wider text-indigo-300/60">
                English Logic & Filler Practice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {appState === "quiz" && (
              <div className="flex items-center gap-3" id="quiz-live-meta">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-indigo-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  {quizMode === "quiz" ? "EXAM TIMER" : "PRACTICE FEEDBACK"}
                </div>
                
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-mono font-bold text-indigo-200">
                  <Clock id="clock-status-icon" className="w-4 h-4 text-indigo-400" />
                  {getFormattedTime(timer)}
                </div>

                <button
                  onClick={submitQuizAnswers}
                  className="px-4 py-1.5 bg-indigo-600/80 hover:bg-indigo-650 text-white font-sans text-xs font-semibold rounded-lg border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-200 cursor-pointer flex items-center gap-1"
                  id="submit-header-button"
                >
                  <CheckCircle2 id="check-icon-finish" className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              </div>
            )}

            {appState === "results" && (
              <button
                onClick={() => setAppState("welcome")}
                className="px-4 py-1.5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white font-sans text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                id="exit-results-button"
              >
                <Home id="home-icon-results" className="w-4 h-4 text-indigo-300" />
                <span>Main Hub</span>
              </button>
            )}

            {appState === "welcome" && stats.completedAttempts > 0 && (
              <button
                onClick={handleResetHistory}
                title="Clear records permanently"
                className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg font-medium transition-colors border border-transparent hover:border-rose-500/30 flex items-center gap-1 cursor-pointer"
                id="reset-history-btn"
              >
                <RefreshCw id="reset-icon" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset History</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Core */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10" id="main-content">
        <AnimatePresence mode="wait">
          
          {/* WELCOME SCREEN */}
          {appState === "welcome" && (
            <motion.div
              key="welcome-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              id="welcome-container"
            >
              {/* Left Column: Introduces Quiz & Modes */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-sans font-semibold">
                    <Star id="star-badge" className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                    <span>Comprehensive 33-Question Workbook</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-white tracking-tight leading-tight">
                    Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Sentence Completion</span> Grammar.
                  </h2>
                  <p className="text-white/70 text-base leading-relaxed font-normal">
                    Develop your logical reasoning, contextual deduction, and grammar mechanics. Each question tests your ability to select the correct words or phrases (fillers) that finish a sentence in a coherent, grammatically precise, and meaningful fashion.
                  </p>
                </div>

                {/* Time Setting Configuration Panel */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl mb-6 relative overflow-hidden" id="time-limit-config">
                  <div className="absolute right-0 top-0 opacity-[0.03] translate-x-3 -translate-y-3">
                    <Clock className="w-24 h-24 text-white" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center">
                      <Clock className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-sm text-white">Question Time Limit Setting</h3>
                      <p className="text-[11px] text-white/50">Each question will automatically advance after these seconds (max 25 seconds)</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-center select-none">
                        <span className="text-3xl font-mono font-black text-indigo-300">{questionTimeLimit}</span>
                        <span className="text-xs text-white/60 ml-1">sec</span>
                      </div>
                      
                    </div>

                    {/* Quick Presets */}
                    
                  </div>
                </div>

                {/* Big Cards of Modes selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="mode-configs">
                  {/* Mode A Column */}
                  <div
                    onClick={() => startQuiz("quiz")}
                    className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.08] hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] rounded-3xl cursor-pointer transition-all duration-300 group relative flex flex-col justify-between"
                    id="select-mode-exam"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white/5 text-indigo-300 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500/30 border border-white/5 transition-colors duration-300">
                        <Clock id="mode-icon-exam" className="w-6 h-6" />
                      </div>
                      <h3 className="font-sans font-bold text-lg text-white mb-1">Standard Exam Mode</h3>
                      <p className="text-xs text-white/60 leading-relaxed mb-4">
                        Simulates a genuine testing environment. Answer each question under standard timer guidelines. Detailed results and scoring explanations are unlocked immediately upon submission.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold mt-2">
                      <span>Launch Exam</span>
                      <ArrowRight id="arrow-mode-exam" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Mode B Column */}
                  
                </div>

                {/* Quick educational facts */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3 text-xs text-white/80" id="direction-tip">
                  <AlertCircle id="tip-info" className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white mb-0.5">Test Directions:</span>
                    In each question, an incomplete statement (Stem) followed by fillers is given. Analyze the context clues, structural conjunctions (e.g. although, because, despite, unless) and select the single option which best completes the incomplete stem correctly and meaningfully.
                  </div>
                </div>
              </div>

              {/* Right Column: High scores, History metrics widget */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl" id="stats-widget">
                  <h3 className="font-sans font-bold text-base text-white flex items-center gap-2 border-b border-white/10 pb-4 mb-4">
                    <Trophy id="trophy-meta-title" className="w-5 h-5 text-amber-500" />
                    <span>Your Learning Performance</span>
                  </h3>

                  {stats.completedAttempts === 0 ? (
                    <div className="text-center py-10 px-4 space-y-3" id="no-history-state">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
                        <HelpCircle id="empty-state-icon" className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white/80">No attempts logged yet</p>
                        <p className="text-xs text-white/45 max-w-xs mx-auto leading-normal">
                          Submit your first Sentence Completion workbook in Standard or Practice Mode to log your scores here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6" id="history-state">
                      {/* Metric highlights */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-[inner_0_0_12px_rgba(255,255,255,0.02)]">
                          <span className="text-xs text-white/50 font-medium block mb-1">Average Accuracy</span>
                          <span className="text-2xl font-mono font-extrabold text-indigo-300">
                            {stats.averageScorePercentage}%
                          </span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-[inner_0_0_12px_rgba(255,255,255,0.02)]">
                          <span className="text-xs text-white/50 font-medium block mb-1">Best Accuracy</span>
                          <span className="text-2xl font-mono font-extrabold text-emerald-300">
                            {stats.bestScorePercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Cumulative details */}
                      <div className="space-y-3.5 border-t border-white/10 pt-4 text-xs font-sans">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-white/30" />
                            Completed Attempts
                          </span>
                          <span className="font-mono font-bold text-white/95">{stats.completedAttempts}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-white/60 font-medium flex items-center gap-1">
                            <HelpCircle className="w-4 h-4 text-white/30" />
                            Questions Attempted
                          </span>
                          <span className="font-mono font-bold text-white/95">{stats.totalQuestionsAnswered}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-white/60 font-medium flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-400" />
                            Passing Streak Session
                          </span>
                          <span className="font-mono font-bold text-white/95 flex items-center gap-1">
                            {stats.streakCount}
                            <span className="text-[10px] text-white/40 font-medium">(≥70%)</span>
                          </span>
                        </div>
                      </div>

                      {/* Frequently missed panel */}
                      {stats.missedQuestionsList.length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-rose-400" />
                            <span>Frequently Missed Items</span>
                          </h4>
                          <p className="text-[11px] text-white/60 leading-normal">
                            You've recently struggled on these questions. Click to target practice them in your next test:
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {stats.missedQuestionsList.map((qId) => (
                              <button
                                key={qId}
                                onClick={() => {
                                  // Lock to practice mode and start immediately
                                  setQuizMode("practice");
                                  setUserAnswers({});
                                  setBookmarked({});
                                  setTimer(0);
                                  const index = QUESTION_BANK.findIndex((q) => q.id === qId);
                                  setCurrentQuestionIndex(index);
                                  setAppState("quiz");
                                }}
                                className="px-2 py-1 bg-white/5 border border-white/10 hover:border-indigo-400 font-mono text-xs text-indigo-300 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                              >
                                #{qId}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Display detail about last attempt */}
                      {lastAttempt && (
                        <div className="border-t border-white/10 pt-4">
                          <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2.5">
                            LATEST COMPLETED RUN
                          </h4>
                          <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-white/90">
                                {Math.round((lastAttempt.score / lastAttempt.totalQuestions) * 100)}% Match Accuracy
                              </span>
                              <span className="text-[10px] text-white/40 block">
                                {new Date(lastAttempt.date).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>
                            <span className="font-mono font-extrabold text-indigo-300">
                              {lastAttempt.score}/{lastAttempt.totalQuestions}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Dynamic helpful quote/card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/80 to-indigo-900/40 border border-white/10 text-white shadow-md relative overflow-hidden" id="tip-branding-hero">
                  <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                    <Brain className="w-36 h-36" />
                  </div>
                  <div className="relative z-10 space-y-2">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-indigo-300 font-bold">
                      Aesthetic Grammatical Strategy
                    </p>
                    <h4 className="font-sans font-bold text-base leading-snug">
                      Recognize Contextual Transition Flags
                    </h4>
                    <p className="text-xs text-indigo-200 leading-relaxed font-light">
                      Watch for contrast words like <strong>'Although'</strong>, <strong>'Unless'</strong>, <strong>'Despite'</strong>, and <strong>'But'</strong>. They indicate that the correct filler must express an opposition to the premises presented in the sentence stem.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ACTIVE QUIZ SCREEN */}
          {appState === "quiz" && (
            <motion.div
              key="active-quiz-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              id="active-quiz-container"
            >
              {/* Left Column: Interactive Nav & Filter controls */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 gap-6 flex flex-col space-y-4" id="controls-column">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="font-sans font-bold text-sm text-white">Quiz Navigation</h3>
                      <p className="text-[11px] text-white/50">Jump directly to any item</p>
                    </div>

                    {/* View Style Switcher */}
                    <div className="flex border border-white/10 bg-white/5 rounded-lg p-0.5" id="view-toggler">
                      <button
                        onClick={() => setViewStyle("focus")}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          viewStyle === "focus"
                            ? "bg-indigo-500/20 text-indigo-300"
                            : "text-white/40 hover:text-white/70"
                        }`}
                        title="Focus View (One by One)"
                        id="btn-view-focus"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewStyle("list")}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          viewStyle === "list"
                            ? "bg-indigo-500/20 text-indigo-300"
                            : "text-white/40 hover:text-white/70"
                        }`}
                        title="Scroll List View (All on board)"
                        id="btn-view-list"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Filters for the Navigation dot tray */}
                  <div className="flex flex-wrap gap-1 border-b border-white/15 pb-35" id="nav-filters">
                    {(["all", "answered", "unanswered", "bookmarked"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        id={`filter-tab-${type}`}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          filterType === type
                            ? "bg-white text-slate-950 shadow-md font-extrabold"
                            : "bg-white/5 text-white/60 border border-white/5 hover:bg-white/10"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Nav Dot Grid */}
                  <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-6 xl:grid-cols-7 gap-1.5" id="navigation-dots-grid">
                    {QUESTION_BANK.map((q, idx) => {
                      const isSelected = idx === currentQuestionIndex;
                      const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
                      const isMarked = bookmarked[q.id] === true;
                      
                      // Match filter type check
                      const passesFilter =
                        filterType === "all" ||
                        (filterType === "answered" && isAnswered) ||
                        (filterType === "unanswered" && !isAnswered) ||
                        (filterType === "bookmarked" && isMarked);

                      return (
                        <button
                          key={q.id}
                          onClick={() => handleJumpToQuestion(q.id)}
                          id={`nav-dot-${q.id}`}
                          className={`relative h-9 rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all duration-150 cursor-pointer ${
                            !passesFilter ? "opacity-25" : "opacity-100"
                          } ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-550 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-102 font-extrabold"
                              : isAnswered
                              ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                              : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                          }`}
                        >
                          {q.id}
                          {isMarked && (
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Compact statistics tracker during quiz */}
                  <div className="space-y-2 pt-3 border-t border-white/10 text-[11px] font-sans text-white/50">
                    <div className="flex justify-between items-center">
                      <span>Total Questions:</span>
                      <span className="font-bold text-white font-mono">33</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Answered:</span>
                      <span className="font-bold text-indigo-300 font-mono">
                        {answeredCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Remaining:</span>
                      <span className="font-bold text-white/80 font-mono">
                        {unansweredCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Bookmarked Reviews:</span>
                      <span className="font-bold text-amber-300 font-mono">
                        {Object.values(bookmarked).filter(Boolean).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instant Submit Checklist panel */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Exam Submission Check</h4>
                    <p className="text-[11px] text-white/50 leading-normal">
                      You can submit at any time. Unanswered questions will be scored as incorrect.
                    </p>
                  </div>

                  {unansweredCount > 0 ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Notice:</strong> You have {unansweredCount} unanswered questions remaining. Click them in the grid above to fill them!
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-[11px] text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Perfect!</strong> All 33 items have been answered. You are fully prepared to submit and lock in your score!
                      </div>
                    </div>
                  )}

                  <button
                    onClick={submitQuizAnswers}
                    className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/40 text-white rounded-xl font-sans text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] text-center flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                    id="primary-submit-btn"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Calculate Score</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Question active card list or paging slider */}
              <div className="lg:col-span-8 space-y-6" id="questions-column">
                
                {/* Mode status block */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Bookmark className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
                        Active Method
                      </span>
                      <h4 className="text-xs font-bold text-indigo-200">
                        {quizMode === "quiz" ? "STANDARD TIMER EXAM MODE" : "SELF-PACED PRACTICE MODE"}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    {/* Toggle bookmark button */}
                    <button
                      onClick={() => toggleBookmark(QUESTION_BANK[currentQuestionIndex].id)}
                      className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-medium border transition-all cursor-pointer ${
                        bookmarked[QUESTION_BANK[currentQuestionIndex].id]
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-200 font-bold"
                          : "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                      }`}
                      id="bookmark-active-button"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          bookmarked[QUESTION_BANK[currentQuestionIndex].id]
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/40"
                        }`}
                      />
                      <span>
                        {bookmarked[QUESTION_BANK[currentQuestionIndex].id] ? "Bookmarked!" : "Bookmark Review"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* COMPACT VIEW OR FOCUS VIEW CARD */}
                {viewStyle === "focus" ? (
                  <div className="space-y-6" id="deck-card-container">
                    {/* Active Question Countdown Timer */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xl" id="question-countdown-module">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Clock className={`w-4 h-4 ${questionTimeRemaining <= 10 ? "text-rose-400 animate-pulse" : "text-indigo-400"}`} />
                        <span className="text-xs text-indigo-200/80 font-mono font-bold">Countdown:</span>
                      </div>
                      <div className="flex-1 bg-white/5 border border-white/5 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            questionTimeRemaining <= 10 ? "bg-gradient-to-r from-rose-500 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                          }`}
                          initial={{ width: "100%" }}
                          animate={{ width: `${(questionTimeRemaining / questionTimeLimit) * 100}%` }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      </div>
                      <span className={`font-mono font-black text-sm px-2.5 py-0.5 rounded bg-white/5 border border-white/10 shrink-0 ${questionTimeRemaining <= 10 ? "text-rose-400 animate-pulse font-extrabold border-rose-500/20" : "text-indigo-350"}`} id="question-countdown-display">
                        {questionTimeRemaining}s
                      </span>
                    </div>

                    <QuizCard
                      question={QUESTION_BANK[currentQuestionIndex]}
                      selectedKey={userAnswers[QUESTION_BANK[currentQuestionIndex].id] || null}
                      onSelect={(key) => handleSelectOption(QUESTION_BANK[currentQuestionIndex].id, key)}
                      isReviewed={quizMode === "practice" && userAnswers[QUESTION_BANK[currentQuestionIndex].id] !== undefined}
                      disabled={false}
                    />

                    {/* Step Pagers */}
                    <div className="flex items-center justify-between" id="paginator-controls">
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/90 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer disabled:cursor-not-allowed"
                        id="prev-pager-btn"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Question</span>
                      </button>

                      <div className="text-xs text-indigo-300/80 font-mono select-none hidden sm:block">
                        Q.{currentQuestionIndex + 1} OF 33
                      </div>

                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.min(QUESTION_BANK.length - 1, prev + 1))}
                        disabled={currentQuestionIndex === QUESTION_BANK.length - 1}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/90 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer disabled:cursor-not-allowed"
                        id="next-pager-btn"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Scrollable cumulative listing
                  <div className="space-y-6" id="cumulative-scroll-list">
                    {QUESTION_BANK.map((q) => (
                      <div
                        key={q.id}
                        ref={(el) => {
                          questionRefs.current[q.id] = el;
                        }}
                        className={`transition-all duration-300 ${
                          currentQuestionIndex === QUESTION_BANK.indexOf(q)
                            ? "ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-[#0b0f19] rounded-3xl"
                            : ""
                        }`}
                      >
                        <QuizCard
                          question={q}
                          selectedKey={userAnswers[q.id] || null}
                          onSelect={(key) => handleSelectOption(q.id, key)}
                          isReviewed={quizMode === "practice" && userAnswers[q.id] !== undefined}
                          disabled={false}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* METRIC PERFORMANCE RESULTS SCREEN */}
          {appState === "results" && lastAttempt && (
            <motion.div
              key="results-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
              id="results-wrapper"
            >
              {/* Score card grid */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center" id="results-scorecard">
                {/* Left side circular progress indicator */}
                <div className="md:col-span-12 lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4" id="circular-gauge-block">
                  <div className="relative w-44 h-44 flex items-center justify-center select-none">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Outer gray track */}
                      <circle
                        cx="88"
                        cy="88"
                        r="76"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="10"
                        fill="transparent"
                        className="transition-all"
                      />
                      {/* Interactive Indigo ring */}
                      <circle
                        cx="88"
                        cy="88"
                        r="76"
                        stroke="#6366f1"
                        strokeWidth="11"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 76}
                        strokeDashoffset={2 * Math.PI * 76 * (1 - lastAttempt.score / lastAttempt.totalQuestions)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))" }}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
                      <span className="text-4xl font-mono font-black text-white tracking-tight">
                        {Math.round((lastAttempt.score / lastAttempt.totalQuestions) * 100)}%
                      </span>
                      <span className="text-[11px] font-mono tracking-widest text-indigo-300 uppercase font-medium">
                        {lastAttempt.score} of {lastAttempt.totalQuestions}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-lg text-white">Test Score Registered</h3>
                    <p className="text-xs text-white/50 font-mono">
                      Completion Time: {getFormattedTime(lastAttempt.timeSpentSeconds)}
                    </p>
                  </div>
                </div>

                {/* Right side diagnostics */}
                <div className="md:col-span-12 lg:col-span-7 space-y-5" id="diagnostic-rubrics">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-indigo-300 font-bold uppercase block mb-1">
                      Academic Diagnosis
                    </span>
                    <h3 className="text-2xl font-sans font-extrabold text-white leading-tight">
                      {getGradeDescriptor((lastAttempt.score / lastAttempt.totalQuestions) * 100).label}
                    </h3>
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed font-normal">
                    {getGradeDescriptor((lastAttempt.score / lastAttempt.totalQuestions) * 100).text} Below is the structural response breakdown. Use the detailed review section below to look through correct definitions and logic explanations for all 33 questions.
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div className="space-y-1">
                      <span className="text-xs text-white/40 block font-medium">Correct Selections:</span>
                      <span className="text-lg font-bold font-mono text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        {lastAttempt.score} Items
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-white/40 block font-medium">Incorrect Selections:</span>
                      <span className="text-lg font-bold font-mono text-rose-300 flex items-center gap-1.5">
                        <XCircle className="w-5 h-5 text-rose-455" />
                        {lastAttempt.totalQuestions - lastAttempt.score} Items
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => startQuiz("quiz")}
                      className="px-5 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white font-sans text-xs font-bold rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center gap-1.5 border border-indigo-500/50"
                      id="retry-quiz-btn"
                    >
                      <RotateCcw className="w-4 h-4 animate-spin-once" />
                      <span>Retake Exam Mode</span>
                    </button>
                    
                    <button
                      onClick={() => startQuiz("practice")}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-sans text-xs font-bold rounded-xl shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                      id="retry-practice-btn"
                    >
                      <BookOpen className="w-4 h-4 text-violet-300" />
                      <span>Switch to Practice Mode</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Highlighted items to revise panel */}
              <div className="space-y-4" id="item-review-header">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-sans font-extrabold text-xl text-white">Detailed Answer Key & Review</h3>
                    <p className="text-xs text-white/50 leading-normal mt-0.5">
                      Examine your chosen response against correct grammar definitions and contextual clues
                    </p>
                  </div>
                  
                  {/* Status checklist filters */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex gap-1 font-sans text-xs" id="review-filters">
                    <span className="font-bold text-indigo-300 uppercase tracking-widest text-[10px] self-center">
                      33 COMPLETE ITEMS WITH EXPLANATIONS
                    </span>
                  </div>
                </div>

                {/* Question scroll listings block */}
                <div className="space-y-6" id="review-cards-bucket">
                  {QUESTION_BANK.map((q) => {
                    const selected = lastAttempt.answers[q.id];
                    return (
                      <QuizCard
                        key={q.id}
                        question={q}
                        selectedKey={selected || null}
                        onSelect={() => {}} // Disabled on review
                        isReviewed={true}
                        disabled={true}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Styled Footer */}
      <footer className="border-t border-white/10 bg-transparent py-6 mt-16 text-center text-xs text-white/40 select-none pb-8" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>
            Sentence Completion Quiz Companion © {new Date().getFullYear()}. Based on original English diagnostic exams.
          </p>
          <p className="text-indigo-300 font-semibold tracking-wide font-sans mt-2">
            Developed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300 font-extrabold px-1 py-0.5 bg-white/10 rounded border border-white/10">Praveen</span>
          </p>
          <p className="text-[10px] text-indigo-400/50 font-mono uppercase tracking-widest mt-1">
            Speed-optimized React Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
