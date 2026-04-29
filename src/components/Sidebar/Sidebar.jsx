import React from 'react';
import './Sidebar.css';
import { SIDEBAR_TOPICS } from '../../constants/systemPrompt.js';

export default function Sidebar({ isOpen, onClose, onTopicSelect, onClearChat, hasMessages }) {
  const handleTopicClick = (prompt) => {
    onTopicSelect(prompt);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        id="sidebar"
        role="navigation"
        aria-label="Topic navigation"
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🗳️</span>
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">ElectionGuide</span>
              <span className="sidebar-logo-sub">AI Civic Assistant</span>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Nav label */}
        <p className="sidebar-nav-label">📚 Topics</p>

        {/* Topic navigation */}
        <nav className="sidebar-nav">
          {SIDEBAR_TOPICS.map(topic => (
            <button
              key={topic.id}
              className="sidebar-nav-item"
              id={`sidebar-nav-${topic.id}`}
              onClick={() => handleTopicClick(topic.prompt)}
              aria-label={`Explore: ${topic.label}`}
            >
              <span className="sidebar-nav-icon">{topic.icon}</span>
              <div className="sidebar-nav-text">
                <span className="sidebar-nav-label-text">{topic.label}</span>
                <span className="sidebar-nav-desc">{topic.desc}</span>
              </div>
              <span className="sidebar-nav-arrow">›</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {hasMessages && (
            <button
              className="clear-chat-btn"
              id="clearChatBtn"
              onClick={() => { onClearChat(); onClose(); }}
              aria-label="Clear chat history"
            >
              <span>🗑️</span>
              <span>Clear Conversation</span>
            </button>
          )}
          <div className="sidebar-disclaimer">
            <span className="disclaimer-icon">⚠️</span>
            <p>Election rules vary by country & region. Always verify details with your official election authority website.</p>
          </div>
          <p className="sidebar-version">ElectionGuide AI · v1.0</p>
        </div>
      </aside>
    </>
  );
}
