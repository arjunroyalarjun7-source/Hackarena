/**
 * Input validation utilities for Sakhi AI API
 */

const ALLOWED_LANGUAGES = ['en-IN', 'ta-IN', 'te-IN', 'en', 'ta', 'te'];

export function validateSessionRequest(body) {
  const errors = [];
  const language = body?.language || 'en-IN';

  if (!ALLOWED_LANGUAGES.includes(language)) {
    errors.push(`Invalid language '${language}'. Supported languages: en-IN, ta-IN, te-IN`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      language: normalizeLanguage(language)
    }
  };
}

export function validateGuideRequest(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object'] };
  }

  const { sessionId, message, language = 'en-IN', action = 'continue' } = body;

  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    errors.push('sessionId is required and must be a non-empty string');
  }

  if (message === undefined || message === null || typeof message !== 'string') {
    errors.push('message is required and must be a string');
  } else if (message.trim().length === 0) {
    errors.push('message cannot be empty');
  } else if (message.length > 1000) {
    errors.push('message exceeds maximum length of 1000 characters');
  }

  if (language && !ALLOWED_LANGUAGES.includes(language)) {
    errors.push(`Invalid language '${language}'. Supported languages: en-IN, ta-IN, te-IN`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      sessionId: sessionId?.trim(),
      message: message?.trim().slice(0, 1000),
      language: normalizeLanguage(language),
      action: typeof action === 'string' ? action.trim().toLowerCase() : 'continue'
    }
  };
}

export function normalizeLanguage(lang = 'en-IN') {
  if (lang.startsWith('ta')) return 'ta-IN';
  if (lang.startsWith('te')) return 'te-IN';
  return 'en-IN';
}
