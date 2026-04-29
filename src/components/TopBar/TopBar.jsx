import React from 'react';
import './TopBar.css';

export default function TopBar({ onMenuClick, onQuizClick, onThemeToggle, theme, detectedLanguage, isLoading }) {
  const isLight = theme === 'light';

  return (
    <header className="topbar" id="topbar">
      <div className="topbar-left">
        <button
          className="menu-btn"
          id="menuBtn"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          title="Open topic menu"
        >
          <span /><span /><span />
        </button>
        <div className="topbar-brand">
          <span className="brand-icon" aria-hidden="true">🗳️</span>
          <div className="brand-text">
            <span className="brand-name">ElectionGuide AI</span>
            <span className="brand-tagline">Multilingual Civic Assistant</span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        {detectedLanguage && (
          <div className="lang-indicator" title="Detected language" aria-label={`Responding in ${detectedLanguage}`}>
            {detectedLanguage}
          </div>
        )}

        <div className="status-badge" aria-label="Guide is active">
          <span className={`status-dot ${isLoading ? 'status-dot--thinking' : ''}`} aria-hidden="true" />
          <span>{isLoading ? 'Thinking…' : 'Online'}</span>
        </div>

        {/* Theme toggle */}
        <button
          className="theme-toggle-btn"
          id="themeToggleBtn"
          onClick={onThemeToggle}
          aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          title={isLight ? 'Dark mode' : 'Light mode'}
        >
          {isLight ? '🌙' : '☀️'}
        </button>

        <button
          className="quiz-launch-btn"
          id="quizLaunchBtn"
          onClick={onQuizClick}
          aria-label="Take a quick knowledge quiz"
          title="Test your election knowledge"
        >
          🧠 Quiz Me
        </button>
      </div>
    </header>
  );
}
