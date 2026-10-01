import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for Sakhi AI guide endpoint
 * Prevents API abuse and controls Gemini API token usage
 */
export const guideRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // Limit each IP to 30 guide requests per minute
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests. Please slow down and try speaking or typing again in a moment.'
  }
});

/**
 * General API rate limiter for other endpoints
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.'
  }
});
