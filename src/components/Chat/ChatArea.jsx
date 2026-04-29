import React, { useEffect, useRef } from 'react';
import './ChatArea.css';
import MessageBubble from './MessageBubble.jsx';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen.jsx';

export default function ChatArea({ messages, hasMessages, onTopicSelect, onFollowUpClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <main className="chat-area" id="chatArea" role="log" aria-live="polite" aria-label="Election guide conversation">
      <div className="chat-inner">
        {!hasMessages ? (
          <WelcomeScreen onTopicSelect={onTopicSelect} />
        ) : (
          <div className="messages-list">
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onFollowUpClick={onFollowUpClick}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </main>
  );
}
