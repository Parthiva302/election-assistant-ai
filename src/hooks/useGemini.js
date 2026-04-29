import { useState, useCallback, useRef } from 'react';
import OpenAI from 'openai';
import { SYSTEM_PROMPT, QUIZ_SYSTEM_PROMPT } from '../constants/systemPrompt.js';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = 'google/gemini-2.0-flash-001';

function createClient() {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('NO_API_KEY');
  }
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'Election Guide AI',
    },
  });
}

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Maintain full conversation history for OpenRouter (stateless API)
  const historyRef = useRef([
    { role: 'system', content: SYSTEM_PROMPT },
  ]);

  /**
   * Send a message and stream the response.
   * onChunk(text) is called with accumulated text on each chunk.
   * Returns the full response text.
   */
  const sendMessage = useCallback(async (message, onChunk) => {
    setIsLoading(true);
    setError(null);

    // Add user message to history
    historyRef.current.push({ role: 'user', content: message });

    try {
      const client = createClient();
      const stream = await client.chat.completions.create({
        model: MODEL,
        messages: historyRef.current,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      });

      let fullText = '';
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        fullText += delta;
        if (onChunk) onChunk(fullText);
      }

      // Add assistant reply to history for next turn
      historyRef.current.push({ role: 'assistant', content: fullText });
      return fullText;
    } catch (err) {
      // Remove the user message we just added (so history stays clean)
      historyRef.current.pop();
      const msg = err.message === 'NO_API_KEY'
        ? 'NO_API_KEY'
        : `Error: ${err.message || 'Something went wrong. Please try again.'}`;
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generate a quiz question using a one-shot call (no history).
   * Returns parsed JSON or null on failure.
   */
  const generateQuiz = useCallback(async (recentContext = '') => {
    try {
      const client = createClient();
      const prompt = recentContext
        ? `Generate a quiz question relevant to this recent topic: "${recentContext}". Respond ONLY with valid JSON.`
        : 'Generate a random election knowledge quiz question. Respond ONLY with valid JSON.';

      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: QUIZ_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 512,
      });

      const text = response.choices[0]?.message?.content?.trim() || '';
      
      // Extract just the JSON object part to avoid parse errors if model adds extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error('Quiz generation failed:', err);
      // Handle OpenRouter rate limits (429) gracefully
      if (err.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      return null;
    }
  }, []);

  /**
   * Reset conversation history so a new session starts fresh.
   */
  const resetChat = useCallback(() => {
    historyRef.current = [{ role: 'system', content: SYSTEM_PROMPT }];
  }, []);

  return { sendMessage, generateQuiz, resetChat, isLoading, error, setError };
}
