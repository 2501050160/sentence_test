import { motion } from "motion/react";
import { Check, X, AlertCircle } from "lucide-react";
import { Question } from "../types";

interface QuizCardProps {
  key?: any;
  question: Question;
  selectedKey: "A" | "B" | "C" | "D" | "E" | null | undefined;
  onSelect: (key: "A" | "B" | "C" | "D" | "E") => void;
  isReviewed?: boolean;
  disabled?: boolean;
}

export function QuizCard({
  question,
  selectedKey,
  onSelect,
  isReviewed = false,
  disabled = false,
}: QuizCardProps) {
  // Determine color status for each option in review/reveal state
  const getOptionStyles = (key: "A" | "B" | "C" | "D" | "E") => {
    const isSelected = selectedKey === key;
    const isCorrect = question.correctKey === key;

    if (isReviewed) {
      if (isCorrect) {
        return {
          bg: "bg-emerald-500/10 border-emerald-500/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
          badge: "bg-emerald-500 text-white",
          icon: <Check id={`check-${question.id}`} className="w-4 h-4 text-emerald-400" />,
        };
      }
      if (isSelected && !isCorrect) {
        return {
          bg: "bg-rose-500/10 border-rose-500/50 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
          badge: "bg-rose-500 text-white",
          icon: <X id={`x-${question.id}`} className="w-4 h-4 text-rose-400" />,
        };
      }
      return {
        bg: "bg-white/5 border-white/5 text-white/40 opacity-40",
        badge: "bg-white/10 text-white/30",
        icon: null,
      };
    }

    if (isSelected) {
      return {
        bg: "bg-indigo-500/20 border-indigo-500/60 text-white ring-1 ring-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.25)]",
        badge: "bg-indigo-600 text-white",
        icon: null,
      };
    }

    return {
      bg: "bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:border-white/30",
      badge: "bg-white/10 text-white/80 group-hover:bg-indigo-500 group-hover:text-white",
      icon: null,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl hover:bg-white/[0.08] transition-all duration-300"
      id={`question-card-${question.id}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className="font-mono text-xs font-semibold px-3 py-1 bg-white/10 text-indigo-300 border border-white/5 rounded-full tracking-wider select-none">
          QUESTION {question.id} OF 33
        </span>
        {isReviewed && (
          <span
            className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1 rounded-full border ${
              selectedKey === question.correctKey
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            {selectedKey === question.correctKey ? (
              <>
                <Check id={`status-check-${question.id}`} className="w-3.5 h-3.5" /> Correct
              </>
            ) : (
              <>
                <X id={`status-x-${question.id}`} className="w-3.5 h-3.5" /> Incorrect
              </>
            )}
          </span>
        )}
      </div>

      <h3 className="font-sans font-light text-xl leading-relaxed text-white mb-6">
        {question.stem}
      </h3>

      <div className="grid grid-cols-1 gap-3.5">
        {question.options.map((option) => {
          const styles = getOptionStyles(option.key);
          return (
            <button
              key={option.key}
              onClick={() => !disabled && onSelect(option.key)}
              disabled={disabled}
              id={`option-${question.id}-${option.key}`}
              className={`group flex items-center justify-between text-left p-4 rounded-xl border transition-all duration-200 w-full focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.99] ${
                styles.bg
              } ${disabled ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3.5 mr-2">
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold border transition-all duration-200 select-none ${
                    styles.badge
                  } border-transparent`}
                >
                  {option.key}
                </span>
                <span className="font-sans text-sm font-medium leading-normal">{option.text}</span>
              </div>
              <div>{styles.icon}</div>
            </button>
          );
        })}
      </div>

      {isReviewed && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl flex gap-3"
          id={`explanation-${question.id}`}
        >
          <AlertCircle id={`alert-icon-${question.id}`} className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-sans text-xs font-bold text-indigo-300 uppercase tracking-wide mb-1">
              Explanation & Answers
            </h4>
            <p className="font-sans text-xs text-white/80 leading-relaxed font-normal">
              <span className="font-semibold block mb-1 text-emerald-300">
                Correct Choice: Option {question.correctKey}
              </span>
              {question.explanation}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
