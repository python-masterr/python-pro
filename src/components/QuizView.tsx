import React, { useState } from 'react';
import { QUIZ_DATA, QuizQuestion } from '../data/pythonData';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, HelpCircle, Trophy, RotateCcw, ArrowRight, ArrowLeft, Award } from 'lucide-react';

export const QuizView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ: QuizQuestion = QUIZ_DATA[currentIndex];
  const selectedOption = userAnswers[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (userAnswers[currentIndex] !== undefined) return; // Prevent changing after choosing

    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    setIsAnswered(true);

    if (optionIndex === currentQ.correct) {
      // Little burst for correct answer
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const calculateScore = () => {
    let score = 0;
    Object.entries(userAnswers).forEach(([qIdx, ans]) => {
      if (QUIZ_DATA[Number(qIdx)].correct === ans) {
        score++;
      }
    });
    return score;
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_DATA.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(userAnswers[currentIndex + 1] !== undefined);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsAnswered(true);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  const score = calculateScore();
  const percentage = Math.round((score / QUIZ_DATA.length) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-900/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-600 text-white shadow-sm">
              Placement Assessment
            </span>
            <span className="text-xs font-mono text-amber-300">
              20 High-Frequency Test Questions
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            <span>Python Placement Quiz</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            20 high-frequency multiple-choice questions testing conceptual clarity and edge cases.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-xs">
          <div>
            <div className="text-slate-400">Current Score</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              {score} / {Object.keys(userAnswers).length}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-slate-400">Total Progress</div>
            <div className="text-slate-200 font-bold mt-0.5">
              {currentIndex + 1} / {QUIZ_DATA.length}
            </div>
          </div>
        </div>
      </div>

      {quizFinished ? (
        /* Quiz Finished Completion Screen */
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You scored <span className="text-amber-400 font-bold">{score} out of {QUIZ_DATA.length}</span> ({percentage}%).
            </p>
          </div>

          <div className="inline-block px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200">
            {percentage >= 80 ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Ready for Top Tier Placement Coding Rounds!
              </span>
            ) : percentage >= 50 ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Good Foundation! Review Notes for Advanced Topics.
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Keep Practicing the 24 Curriculum Notes.
              </span>
            )}
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Assessment</span>
            </button>
          </div>
        </div>
      ) : (
        /* Question Card */
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl p-6 space-y-6">
          {/* Question Meta */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-semibold text-amber-400">
              Question {currentIndex + 1} of {QUIZ_DATA.length}
            </span>
            <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_DATA.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="text-lg md:text-xl font-bold text-white leading-snug">
            {currentQ.q}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQ.a.map((option, idx) => {
              const isChosen = selectedOption === idx;
              const hasAnswered = selectedOption !== undefined;
              const isCorrect = idx === currentQ.correct;

              let btnStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10';
                } else if (isChosen) {
                  btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md shadow-rose-500/10';
                } else {
                  btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border text-left font-medium text-sm transition flex items-center justify-between gap-4 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {hasAnswered && (
                    <div>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Card */}
          {selectedOption !== undefined && (
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 space-y-1 animate-fade-in">
              <div className="font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>Explanation:</span>
              </div>
              <p className="leading-relaxed">{currentQ.why}</p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Quick jump dots */}
            <div className="hidden sm:flex items-center gap-1 max-w-[280px] overflow-x-auto py-1">
              {QUIZ_DATA.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsAnswered(userAnswers[i] !== undefined);
                  }}
                  className={`w-6 h-6 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    i === currentIndex
                      ? 'bg-amber-500 text-white'
                      : userAnswers[i] !== undefined
                      ? userAnswers[i] === QUIZ_DATA[i].correct
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>{currentIndex === QUIZ_DATA.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
