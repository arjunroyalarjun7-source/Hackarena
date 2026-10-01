import express from 'express';
import { GuideController } from '../controllers/guideController.js';
import { guideRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Health check
router.get('/health', GuideController.health);

// Session endpoints
router.post('/session', GuideController.createSession);
router.get('/session/:sessionId', GuideController.getSession);

// Core guide endpoint protected by rate limiter
router.post('/guide', guideRateLimiter, GuideController.processGuide);

export default router;
