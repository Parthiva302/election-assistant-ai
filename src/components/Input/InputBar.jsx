import React, { useRef, useEffect } from 'react';
import './InputBar.css';

export default function InputBar({ onSend, isLoading, disabled }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const text = ta.value.trim();
    if (!text || isLoading) return;
    onSend(text);
    ta.value = '';
    ta.style.height = 'auto';
  };

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <footer className="input-area" id="inputArea">
      <div className="input-wrapper">
        <div className="input-inner">
          <div className="input-glow" />
          <textarea
            ref={textareaRef}
            id="userInput"
            className="input-textarea"
            placeholder="Ask anything about elections… or type in any language 🌐"
            rows={1}
            aria-label="Type your question about elections"
            maxLength={1000}
            disabled={disabled || isLoading}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`send-btn ${isLoading ? 'send-btn--loading' : ''}`}
            id="sendBtn"
            onClick={handleSend}
            disabled={disabled || isLoading}
            aria-label="Send message"
            title="Send (Enter)"
          >
            {isLoading ? (
              <span className="send-spinner" aria-hidden="true" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>

        <div className="input-meta">
          <p className="input-disclaimer">
            🌐 Election rules vary by country &amp; region — always verify with your official election authority.
          </p>
          <span className="input-hint">Enter ↵ to send · Shift+Enter for new line</span>
        </div>
      </div>
    </footer>
  );
}
