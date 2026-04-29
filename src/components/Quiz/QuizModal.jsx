import React, { useState, useEffect } from 'react';
import './QuizModal.css';

export default function QuizModal({ isOpen, onClose, onGenerateQuiz, isGenerating }) {
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [error, setError] = useState(null);

  // Load a new quiz whenever modal opens
  useEffect(() => {
    if (isOpen && !quiz && !isGenerating) {
      loadQuiz();
    }
  }, [isOpen]);

  const loadQuiz = async () => {
    setError(null);
    setSelected(null);
    setRevealed(false);
    setQuiz(null);
    try {
      const q = await onGenerateQuiz();
      if (q) {
        setQuiz(q);
      } else {
        setError('Could not generate a quiz question. Please try again.');
      }
    } catch (err) {
      setError(err.message === 'NO_API_KEY'
        ? 'API key not set. Please configure your Gemini API key.'
        : 'Failed to generate quiz. Please try again.');
    }
  };

  const handleOptionClick = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const isCorrect = idx === quiz.correctIndex;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    loadQuiz();
  };

  const handleClose = () => {
    setQuiz(null);
    setSelected(null);
    setRevealed(false);
    onClose();
  };

  if (!isOpen) return null;

  const getOptionClass = (idx) => {
    if (!revealed) return 'quiz-option';
    if (idx === quiz.correctIndex) return 'quiz-option quiz-option--correct';
    if (idx === selected && idx !== quiz.correctIndex) return 'quiz-option quiz-option--wrong';
    return 'quiz-option quiz-option--dim';
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div
      className="quiz-overlay"
      id="quizOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quizModalTitle"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="quiz-modal" id="quizModal">
        {/* Header */}
        <div className="quiz-modal-header">
          <div className="quiz-title-row">
            <span className="quiz-icon">🧠</span>
            <div>
              <h2 className="quiz-modal-title" id="quizModalTitle">Quick Knowledge Check</h2>
              <p className="quiz-modal-sub">Test your election knowledge!</p>
            </div>
          </div>
          <div className="quiz-header-right">
            {score.total > 0 && (
              <div className="quiz-score" aria-label={`Score: ${score.correct} out of ${score.total}`}>
                <span className="score-label">Score</span>
                <span className="score-value">{score.correct}/{score.total}</span>
              </div>
            )}
            <button
              className="quiz-close-btn"
              onClick={handleClose}
              aria-label="Close quiz"
            >✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="quiz-body" id="quizBody">
          {/* Loading state */}
          {!quiz && !error && (
            <div className="quiz-loading">
              <div className="quiz-loading-spinner" aria-hidden="true" />
              <p>Generating your question…</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="quiz-error">
              <span className="quiz-error-icon">⚠️</span>
              <p>{error}</p>
              <button className="quiz-retry-btn" onClick={loadQuiz}>Try Again</button>
            </div>
          )}

          {/* Quiz question */}
          {quiz && !error && (
            <>
              <div className="quiz-question-wrap">
                <p className="quiz-question">{quiz.question}</p>
              </div>

              <div className="quiz-options" role="list">
                {quiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={getOptionClass(idx)}
                    onClick={() => handleOptionClick(idx)}
                    disabled={revealed}
                    role="listitem"
                    id={`quiz-option-${idx}`}
                    aria-label={`Option ${optionLabels[idx]}: ${opt}`}
                  >
                    <span className="option-label">{optionLabels[idx]}</span>
                    <span className="option-text">{opt}</span>
                    {revealed && idx === quiz.correctIndex && (
                      <span className="option-badge option-badge--correct">✓</span>
                    )}
                    {revealed && idx === selected && idx !== quiz.correctIndex && (
                      <span className="option-badge option-badge--wrong">✗</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {revealed && (
                <div
                  className={`quiz-explanation ${selected === quiz.correctIndex ? 'quiz-explanation--correct' : 'quiz-explanation--wrong'}`}
                  aria-live="polite"
                >
                  <span className="explanation-icon">
                    {selected === quiz.correctIndex ? '🎉' : '💡'}
                  </span>
                  <div>
                    <p className="explanation-result">
                      {selected === quiz.correctIndex ? 'Correct! Well done!' : 'Not quite — here\'s the answer:'}
                    </p>
                    <p className="explanation-text">{quiz.explanation}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {revealed && (
                <div className="quiz-actions">
                  <button className="quiz-next-btn" onClick={handleNext} id="quizNextBtn">
                    Another Question →
                  </button>
                  <button className="quiz-done-btn" onClick={handleClose}>
                    Done
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
