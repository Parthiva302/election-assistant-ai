import { useState, useCallback, useEffect } from 'react';
import { formatTime } from '../utils/parseResponse.js';

const STORAGE_KEY = 'electionGuide_chatHistory';

export function useChat() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage quota exceeded — ignore
    }
  }, [messages]);

  const addMessage = useCallback((role, content) => {
    const msg = {
      id: Date.now().toString(),
      role,        // 'user' | 'assistant'
      content,
      timestamp: formatTime(new Date()),
    };
    setMessages(prev => [...prev, msg]);
    return msg.id;
  }, []);

  // Update the last assistant message (used during streaming)
  const updateLastMessage = useCallback((content) => {
    setMessages(prev => {
      const updated = [...prev];
      const lastIdx = updated.length - 1;
      if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
        updated[lastIdx] = { ...updated[lastIdx], content };
      }
      return updated;
    });
  }, []);

  // Add an empty assistant placeholder (streaming target)
  const addPlaceholder = useCallback(() => {
    const msg = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '',
      timestamp: formatTime(new Date()),
      isStreaming: true,
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  // Mark last message as done streaming
  const finishStreaming = useCallback(() => {
    setMessages(prev => {
      const updated = [...prev];
      const lastIdx = updated.length - 1;
      if (lastIdx >= 0) {
        updated[lastIdx] = { ...updated[lastIdx], isStreaming: false };
      }
      return updated;
    });
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get recent context text for quiz generation
  const getRecentContext = useCallback(() => {
    const recent = messages.slice(-6);
    return recent.map(m => m.content).join(' ').slice(0, 500);
  }, [messages]);

  return {
    messages,
    addMessage,
    updateLastMessage,
    addPlaceholder,
    finishStreaming,
    clearChat,
    getRecentContext,
    hasMessages: messages.length > 0,
  };
}
