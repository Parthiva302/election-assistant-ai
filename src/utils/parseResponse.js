/**
 * Extracts → follow-up suggestion lines from AI response text.
 * Returns array of strings (the suggestion text without the → prefix).
 */
export function parseFollowUps(text) {
  const lines = text.split('\n');
  const followUps = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('→ ')) {
      followUps.push(trimmed.slice(2).trim());
    }
  }
  return followUps;
}

/**
 * Removes the → follow-up lines from the text so they aren't
 * rendered twice (once in markdown, once as chips).
 */
export function stripFollowUps(text) {
  return text
    .split('\n')
    .filter(line => !line.trim().startsWith('→ '))
    .join('\n')
    .trim();
}

/**
 * Detects a rough language name from the text for the UI badge.
 * This is a simple heuristic — the real language handling is done by Gemini.
 */
export function detectDisplayLanguage(text) {
  if (!text) return null;
  // Hindi/Devanagari
  if (/[\u0900-\u097F]/.test(text)) return '🇮🇳 Hindi';
  // Arabic
  if (/[\u0600-\u06FF]/.test(text)) return '🌍 Arabic';
  // Chinese
  if (/[\u4E00-\u9FFF]/.test(text)) return '🇨🇳 Chinese';
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return '🇮🇳 Tamil';
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) return '🇮🇳 Telugu';
  // Bengali
  if (/[\u0980-\u09FF]/.test(text)) return '🇧🇩 Bengali';
  // Spanish keywords
  if (/\b(cómo|votar|elección|registrar|hola)\b/i.test(text)) return '🇪🇸 Spanish';
  // French keywords
  if (/\b(comment|voter|élection|bonjour|merci)\b/i.test(text)) return '🇫🇷 French';
  // Portuguese
  if (/\b(como|votar|eleição|olá|obrigado)\b/i.test(text)) return '🇧🇷 Portuguese';
  // German
  if (/\b(wie|wählen|wahl|hallo|danke)\b/i.test(text)) return '🇩🇪 German';
  // Swahili
  if (/\b(habari|kura|uchaguzi|asante)\b/i.test(text)) return '🌍 Swahili';
  return '🇬🇧 English';
}

/**
 * Generates a formatted timestamp string.
 */
export function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
