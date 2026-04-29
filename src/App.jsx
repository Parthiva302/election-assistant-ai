import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import TopBar from './components/TopBar/TopBar.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import ChatArea from './components/Chat/ChatArea.jsx';
import InputBar from './components/Input/InputBar.jsx';
import QuizModal from './components/Quiz/QuizModal.jsx';
import { useGemini } from './hooks/useGemini.js';
import { useChat } from './hooks/useChat.js';
import { detectDisplayLanguage } from './utils/parseResponse.js';

// ── Theme management ──────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('electionGuide_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('electionGuide_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  const { sendMessage, generateQuiz, resetChat, isLoading } = useGemini();
  const {
    messages, addMessage, updateLastMessage, addPlaceholder,
    finishStreaming, clearChat, getRecentContext, hasMessages,
  } = useChat();

  const handleSend = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    // Detect language from user input for the badge
    const lang = detectDisplayLanguage(text);
    if (lang) setDetectedLanguage(lang);

    addMessage('user', text);
    addPlaceholder();

    try {
      await sendMessage(text, (streamedText) => {
        updateLastMessage(streamedText);
      });
      finishStreaming();
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        updateLastMessage(
          '⚠️ **API Key Not Configured**\n\n' +
          'To use Election Guide AI you need an API key.\n\n' +
          '**Quick setup:**\n' +
          '1. Create a `.env` file in the project root\n' +
          '2. Add: `VITE_OPENROUTER_API_KEY=your_key_here`\n' +
          '3. Get a free key at [openrouter.ai](https://openrouter.ai)\n' +
          '4. Restart the dev server\n\n' +
          'Your key stays local — it\'s never shared. 🔒'
        );
      } else {
        updateLastMessage(
          '⚠️ **Something went wrong**\n\n' +
          `${err.message}\n\n` +
          'Please try again. If the issue persists, check your API key and internet connection.'
        );
      }
      finishStreaming();
    }
  }, [isLoading, addMessage, addPlaceholder, sendMessage, updateLastMessage, finishStreaming]);

  const handleTopicSelect = useCallback((prompt) => {
    setSidebarOpen(false);
    handleSend(prompt);
  }, [handleSend]);

  const handleFollowUpClick = useCallback((text) => {
    handleSend(text);
  }, [handleSend]);

  const handleClearChat = useCallback(() => {
    clearChat();
    resetChat();
    setDetectedLanguage(null);
    setSidebarOpen(false);
  }, [clearChat, resetChat]);

  const handleGenerateQuiz = useCallback(async () => {
    const context = getRecentContext();
    return generateQuiz(context);
  }, [generateQuiz, getRecentContext]);

  return (
    <div className="app-root">
      {/* Animated background orbs */}
      <div className="app-bg" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-orb bg-orb-4" />
        <div className="bg-orb bg-orb-5" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onTopicSelect={handleTopicSelect}
        onClearChat={handleClearChat}
        hasMessages={hasMessages}
      />

      <div className="app-main">
        <TopBar
          onMenuClick={() => setSidebarOpen(o => !o)}
          onQuizClick={() => setQuizOpen(true)}
          onThemeToggle={toggleTheme}
          theme={theme}
          detectedLanguage={detectedLanguage}
          isLoading={isLoading}
        />

        <ChatArea
          messages={messages}
          hasMessages={hasMessages}
          onTopicSelect={handleTopicSelect}
          onFollowUpClick={handleFollowUpClick}
        />

        <InputBar
          onSend={handleSend}
          isLoading={isLoading}
          disabled={false}
        />
      </div>

      <QuizModal
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        onGenerateQuiz={handleGenerateQuiz}
        isGenerating={isLoading}
      />
    </div>
  );
}
