import React from 'react';
import './WelcomeScreen.css';
import { WELCOME_TOPICS } from '../../constants/systemPrompt.js';

export default function WelcomeScreen({ onTopicSelect }) {
  return (
    <div className="welcome-screen">
      {/* Floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="welcome-hero">
        <div className="ballot-icon-wrap">
          <div className="ballot-icon">🗳️</div>
          <div className="icon-ring icon-ring-1" />
          <div className="icon-ring icon-ring-2" />
        </div>
        <h1 className="welcome-title">Election Guide AI</h1>
        <p className="welcome-subtitle">
          Your warm, multilingual civic guide — understand elections <br />
          <span className="highlight">step by step, in any language 🌐</span>
        </p>
        <div className="language-badges">
          {['🇬🇧 EN', '🇮🇳 HI', '🇪🇸 ES', '🇫🇷 FR', '🇸🇦 AR', '🇧🇷 PT', '+ more'].map(lang => (
            <span key={lang} className="lang-badge">{lang}</span>
          ))}
        </div>
      </div>

      <div className="welcome-prompt">
        <p className="welcome-prompt-label">✨ Choose a topic to get started, or type your question below</p>
      </div>

      <div className="topics-grid">
        {WELCOME_TOPICS.map((topic, i) => {
          const colorVars = [
            'var(--accent)', 
            'var(--gold)', 
            'var(--color-cyan)', 
            'var(--color-pink)', 
            'var(--color-emerald)', 
            'var(--color-orange)', 
            'var(--purple)'
          ];
          const cardColor = colorVars[i % colorVars.length];
          
          return (
            <button
              key={topic.id}
              className="topic-card"
              style={{ '--card-color': cardColor }}
              onClick={() => onTopicSelect(topic.prompt)}
              id={`topic-${topic.id}`}
              aria-label={`Learn about ${topic.label}`}
            >
              <span className="topic-card-icon">{topic.icon}</span>
              <div className="topic-card-text">
                <span className="topic-card-label">{topic.label}</span>
                <span className="topic-card-desc">{topic.desc}</span>
              </div>
              <span className="topic-card-arrow" style={{ color: cardColor }}>→</span>
            </button>
          );
        })}
      </div>

      <p className="welcome-footer-note">
        🌐 Just write to me in <strong>any language</strong> — I'll reply in the same language!
      </p>
    </div>
  );
}
