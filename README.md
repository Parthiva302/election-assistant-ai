# ElectionGuide AI — Multilingual Civic Assistant 🗳️

A premium, interactive web application acting as a multilingual civic guide. Powered by Google Gemini 2.0 Flash (via OpenRouter), it features a rich chat interface, dynamic topic navigation, built-in knowledge quizzes, and a responsive design that supports multiple languages to empower first-time voters.

---

## 🎯 Chosen Vertical: Civic Technology & Voter Education
We chose the **Civic Tech** vertical because understanding the democratic process should be a fundamental, frictionless right. Often, official election resources are dense, jargon-heavy, and difficult to navigate. This application bridges that gap by providing a neutral, friendly, and deeply accessible AI assistant that breaks down complex electoral systems into simple, digestible, and multilingual concepts.

## 🧠 Approach and Logic
Our core approach was to build an AI that behaves less like a generic chatbot and more like a structured **educational guide**. 
1. **System Prompting:** We engineered a strict system prompt that forces the AI to remain entirely neutral, avoid political bias, write at a middle-school reading level, and structure answers using scannable markdown (bullet points, emojis, TL;DRs).
2. **Dynamic UI:** Rather than a blank chat box, we provide 10 predefined civic topics (e.g., "Voter Registration", "Electoral Systems") via a sidebar and welcome screen. This guides users who might not know what to ask.
3. **Interactive Follow-ups & Quizzes:** To ensure active learning, the AI parses responses to suggest clickable follow-up questions, and a dedicated Quiz Engine dynamically generates context-aware multiple-choice questions to test the user's knowledge.

## ⚙️ How the Solution Works
- **Frontend Stack:** React, Vite, CSS Variables (for Light/Dark mode).
- **AI Integration:** The app uses the `openai` SDK to connect to OpenRouter's API, explicitly calling the `google/gemini-2.0-flash-001` model.
- **State Management:** Custom React hooks (`useChat`, `useGemini`) isolate business logic. Chat history is saved locally via `localStorage` to persist across sessions.
- **Streaming:** The chat utilizes real-time token streaming to ensure a highly responsive, low-latency feel, complete with a blinking cursor animation.

## 📝 Assumptions Made
1. **API Availability:** Assumes the user has access to a valid OpenRouter API key with access to Gemini 2.0 Flash.
2. **General Rules vs Local Laws:** The AI is instructed to explain *general* democratic principles (like how FPTP works) but assumes the user will verify specific deadlines and rules with their local election authority (a disclaimer is permanently visible).
3. **Modern Browser:** Assumes the user is on a modern browser that supports CSS Variables, Flexbox/Grid, and the `color-mix()` function.

---

## 💻 Code Quality
- **Component Structure:** The UI is strictly modular (`TopBar`, `Sidebar`, `MessageBubble`, `ChatArea`, `QuizModal`).
- **Separation of Concerns:** UI rendering is separated from API logic (`useGemini.js`) and state management (`useChat.js`). System prompts and static data are isolated in `constants/systemPrompt.js`.
- **Readability:** Clean CSS organization with semantic variables, consistent naming conventions, and well-commented code blocks explaining complex regex or streaming logic.

## 🔒 Security
- **Safe API Key Handling:** The API key is loaded via Vite environment variables (`import.meta.env`) and `.env` files are strictly added to `.gitignore` to prevent accidental credential leaking.
- **Content Guardrails:** The system prompt acts as a security layer against prompt-injection for political bias, explicitly instructing the model to refuse partisan questions and remain neutral.
- **Safe DOM Parsing:** We use `react-markdown` and `remark-gfm` to render the AI's output, preventing Cross-Site Scripting (XSS) attacks that could occur if we unsafely injected raw HTML using `dangerouslySetInnerHTML`.

## ⚡ Efficiency
- **Optimized Rendering:** Utilizing React `useCallback` and memoization where necessary to prevent unnecessary re-renders during high-frequency text streaming.
- **Lightweight Styling:** The app relies entirely on Vanilla CSS rather than heavy utility frameworks like Tailwind or component libraries, keeping the bundle size incredibly small and CSS parsing fast.
- **Stateless API:** We maintain the conversation history array locally and pass it to the stateless OpenRouter API, ensuring we have total control over memory footprint and token usage.

## 🧪 Testing
- **Visual & Layout Testing:** Extensive manual testing across desktop and mobile viewports to ensure the sidebar drawer and chat bubbles scale appropriately.
- **API Robustness:** The `useGemini` hook includes specific `try/catch` blocks to gracefully handle missing API keys, OpenRouter `429 Rate Limit` errors, and malformed JSON payloads during Quiz generation via fallback Regex parsing.
- **Theme Testing:** Confirmed CSS variable inheritance works flawlessly when toggling the `data-theme` attribute on the `documentElement` between `dark` and `light` modes.

## ♿ Accessibility (a11y)
- **Inclusive Design:** 
  - Full native multilingual support (the AI detects and replies in any language the user types).
  - High contrast color palettes (`color-mix` ensures the TopBar remains readable over any background).
- **Semantic HTML & ARIA:** Buttons have distinct `aria-label`s, decorative elements use `aria-hidden="true"`, and the app utilizes semantic tags like `<aside>`, `<nav>`, `<header>`, and `<main>`.
- **Usability:** Large, easily "handable" touch targets on mobile for the sidebar and topic cards.

---

## 🚀 Getting Started
1. Clone the repository.
2. Create a `.env` file in the root directory: `VITE_OPENROUTER_API_KEY=your_key_here`
3. Run `npm install`
4. Run `npm run dev`
5. Open `http://localhost:5173`
