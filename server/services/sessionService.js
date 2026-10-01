import { randomUUID } from 'crypto';
import { SchemeService } from './schemeService.js';

class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  createSession(language = 'en-IN') {
    const sessionId = randomUUID();
    const totalSteps = SchemeService.getTotalSteps() || 5;
    const session = {
      id: sessionId,
      language: language || 'en-IN',
      currentStep: 1,
      totalSteps,
      journeyComplete: false,
      answers: [],
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    if (!sessionId) return null;
    return this.sessions.get(sessionId) || null;
  }

  updateSession(sessionId, updates) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  addMessageToHistory(sessionId, role, text) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.history.push({
      role: role === 'user' ? 'user' : 'model',
      text,
      timestamp: new Date().toISOString()
    });

    session.updatedAt = new Date().toISOString();
    return session;
  }

  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  // Periodic cleanup for stale sessions (> 24 hours)
  cleanStaleSessions(maxAgeMs = 24 * 60 * 60 * 1000) {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - new Date(session.updatedAt).getTime() > maxAgeMs) {
        this.sessions.delete(id);
      }
    }
  }
}

export const sessionService = new SessionStore();
