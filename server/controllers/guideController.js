import { sessionService } from '../services/sessionService.js';
import { SchemeService } from '../services/schemeService.js';
import { generateSakhiResponse, isGeminiConfigured } from '../services/geminiService.js';
import { validateGuideRequest, validateSessionRequest } from '../utils/validators.js';

export class GuideController {
  /**
   * Health check endpoint
   */
  static async health(req, res) {
    const hasKey = isGeminiConfigured();
    res.json({
      status: 'ok',
      service: 'Sakhi AI Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      geminiConfigured: hasKey,
      message: hasKey
        ? 'Sakhi AI is ready to assist.'
        : 'Gemini API key is not configured. Add GEMINI_API_KEY to server/.env.'
    });
  }

  /**
   * Initialize a new user session
   */
  static async createSession(req, res) {
    try {
      const validation = validateSessionRequest(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, errors: validation.errors });
      }

      const language = validation.sanitized.language;
      const session = sessionService.createSession(language);
      const scheme = SchemeService.getScheme();
      const firstQuestion = SchemeService.getQuestion(1, language);

      return res.status(201).json({
        success: true,
        sessionId: session.id,
        language: session.language,
        progress: {
          current: 1,
          total: session.totalSteps
        },
        initialQuestion: firstQuestion,
        scheme: {
          id: scheme.id,
          name: scheme.name,
          badge: scheme.badge,
          disclaimer: scheme.disclaimer,
          officialUrl: scheme.officialUrl,
          source: scheme.source,
          lastVerified: scheme.lastVerified
        }
      });
    } catch (err) {
      console.error('Create Session Error:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to initialize session. Please try again.'
      });
    }
  }

  /**
   * Retrieve current session state
   */
  static async getSession(req, res) {
    try {
      const { sessionId } = req.params;
      const session = sessionService.getSession(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found. Please start a new session.'
        });
      }

      const scheme = SchemeService.getScheme();

      return res.json({
        success: true,
        session: {
          id: session.id,
          language: session.language,
          currentStep: session.currentStep,
          totalSteps: session.totalSteps,
          journeyComplete: session.journeyComplete,
          historyCount: session.history.length
        },
        scheme: {
          id: scheme.id,
          name: scheme.name,
          badge: scheme.badge,
          disclaimer: scheme.disclaimer
        }
      });
    } catch (err) {
      console.error('Get Session Error:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Error retrieving session information.'
      });
    }
  }

  /**
   * Process a guide interaction (voice transcript or typed message)
   */
  static async processGuide(req, res) {
    try {
      // 1. Validate request
      const validation = validateGuideRequest(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      const { sessionId, message, language } = validation.sanitized;

      // 2. Find or create session
      let session = sessionService.getSession(sessionId);
      if (!session) {
        session = sessionService.createSession(language);
      } else if (language && session.language !== language) {
        sessionService.updateSession(sessionId, { language });
      }

      // Check if Gemini key is configured
      if (!isGeminiConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Gemini API key is not configured. Add GEMINI_API_KEY to server/.env.',
          isConfigError: true
        });
      }

      // 3. Load service scheme data
      const scheme = SchemeService.getScheme();

      // 4. Save user message to session history
      sessionService.addMessageToHistory(session.id, 'user', message);

      // Record answer
      const answers = [...(session.answers || []), { step: session.currentStep, answer: message }];

      // 5. Send context to Gemini
      const geminiResponse = await generateSakhiResponse({
        userMessage: message,
        language: session.language,
        history: session.history,
        scheme,
        journeyState: {
          currentStep: session.currentStep,
          totalSteps: session.totalSteps,
          answers
        }
      });

      // 6. Validate & update session state
      const nextStep = geminiResponse.journeyComplete
        ? session.totalSteps
        : geminiResponse.progress?.current || Math.min(session.currentStep + 1, session.totalSteps);

      sessionService.updateSession(session.id, {
        currentStep: nextStep,
        journeyComplete: Boolean(geminiResponse.journeyComplete),
        answers
      });

      // 7. Save model reply to history
      const responseSpeechText = geminiResponse.reply + (geminiResponse.nextQuestion ? ` ${geminiResponse.nextQuestion}` : '');
      sessionService.addMessageToHistory(session.id, 'model', responseSpeechText);

      // 8. Return structured response to frontend
      return res.json({
        success: true,
        sessionId: session.id,
        data: {
          intent: geminiResponse.intent || 'eligibility',
          reply: geminiResponse.reply,
          nextQuestion: geminiResponse.nextQuestion,
          progress: geminiResponse.progress || { current: nextStep, total: session.totalSteps },
          options: geminiResponse.options || ['Yes', 'No', "I don't know"],
          nextAction: geminiResponse.nextAction || (geminiResponse.journeyComplete ? 'view_result' : 'continue'),
          journeyComplete: Boolean(geminiResponse.journeyComplete),
          documents: geminiResponse.documents || (geminiResponse.journeyComplete ? SchemeService.getDocuments() : []),
          journeyCard: geminiResponse.journeyCard || (geminiResponse.journeyComplete ? {
            title: 'Your Sakhi Journey',
            status: 'Based on your answers, you may meet the listed criteria',
            steps: SchemeService.getApplicationSteps()
          } : null),
          source: geminiResponse.source || {
            name: scheme.source,
            url: scheme.officialUrl
          },
          disclaimer: scheme.disclaimer,
          badge: scheme.badge
        }
      });
    } catch (err) {
      console.error('Process Guide Error:', err.message);
      
      const msg = err.message || '';
      if (msg.includes('GEMINI_API_KEY') || msg.includes('configured')) {
        return res.status(503).json({
          success: false,
          error: 'Gemini API key is not configured. Add GEMINI_API_KEY to server/.env.',
          isConfigError: true
        });
      }

      if (msg.includes('Invalid Gemini API key') || msg.includes('401') || msg.includes('UNAUTHENTICATED') || msg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED')) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Gemini API key in server/.env. Make sure to paste a valid Google AI Studio key starting with AIzaSy... (get free key from https://aistudio.google.com/app/apikey)',
          isConfigError: true
        });
      }

      return res.status(500).json({
        success: false,
        error: msg.length < 150 ? msg : 'Sakhi AI encountered an issue contacting Gemini. Please verify your internet and API key in server/.env.'
      });
    }
  }
}
