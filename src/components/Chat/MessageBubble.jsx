import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MessageBubble.css';
import { parseFollowUps, stripFollowUps } from '../../utils/parseResponse.js';

export default function MessageBubble({ message, onFollowUpClick }) {
  const { role, content, timestamp, isStreaming } = message;
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const bubbleRef = useRef(null);

  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  const followUps = !isUser ? parseFollowUps(content) : [];
  const cleanContent = !isUser ? stripFollowUps(content) : content;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silently
    }
  };

  return (
    <div
      ref={bubbleRef}
      className={`message-row ${isUser ? 'message-row--user' : 'message-row--ai'}`}
    >
      {!isUser && (
        <div className="avatar avatar--ai" aria-label="AI Guide">
          🗳️
        </div>
      )}

      <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--ai'}`}>
        {isUser ? (
          <p className="bubble-user-text">{content}</p>
        ) : (
          <>
            <div className="bubble-ai-content">
              {content === '' && isStreaming ? (
                <div className="typing-indicator" aria-label="AI is typing">
                  <span /><span /><span />
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
                    h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
                    h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
                    p: ({ children }) => <p className="md-p">{children}</p>,
                    ul: ({ children }) => <ul className="md-ul">{children}</ul>,
                    ol: ({ children }) => <ol className="md-ol">{children}</ol>,
                    li: ({ children }) => <li className="md-li">{children}</li>,
                    strong: ({ children }) => <strong className="md-strong">{children}</strong>,
                    blockquote: ({ children }) => (
                      <blockquote className="md-blockquote">{children}</blockquote>
                    ),
                    hr: () => <hr className="md-hr" />,
                    code: ({ inline, children }) =>
                      inline
                        ? <code className="md-code-inline">{children}</code>
                        : <pre className="md-code-block"><code>{children}</code></pre>,
                  }}
                >
                  {cleanContent}
                </ReactMarkdown>
              )}
              {isStreaming && content !== '' && (
                <span className="streaming-cursor" aria-hidden="true">▊</span>
              )}
            </div>

            {/* Follow-up chips */}
            {followUps.length > 0 && !isStreaming && (
              <div className="followup-chips">
                <p className="followup-label">💡 What next?</p>
                <div className="chips-list">
                  {followUps.map((fu, i) => (
                    <button
                      key={i}
                      className="chip"
                      onClick={() => onFollowUpClick(fu)}
                      id={`followup-chip-${message.id}-${i}`}
                    >
                      → {fu}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions bar */}
            {!isStreaming && content && (
              <div className="bubble-actions">
                <span className="msg-timestamp">{timestamp}</span>
                <button
                  className="copy-btn"
                  onClick={handleCopy}
                  aria-label="Copy response"
                  title="Copy to clipboard"
                >
                  {copied ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
            )}
          </>
        )}

        {isUser && (
          <span className="msg-timestamp msg-timestamp--user">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <div className="avatar avatar--user" aria-label="You">
          👤
        </div>
      )}
    </div>
  );
}
