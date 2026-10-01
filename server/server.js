import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import guideRoutes from './routes/guideRoutes.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';

// Load environment variables from server/.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security and CORS configuration (Allows all devices on network / localhost / mobile)
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request parsing with size limit
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Apply general rate limiter
app.use('/api', generalRateLimiter);

// API Routes
app.use('/api', guideRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    service: 'Sakhi AI API',
    status: 'online',
    tagline: 'Speak. Understand. Access.',
    documentation: 'See /api/health for system status'
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Requested API endpoint not found.'
  });
});

// Centralized error handling (Never leak stack traces)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    error: 'A server error occurred. Please try again shortly.'
  });
});

function startServer(portToTry) {
  const server = app.listen(portToTry, '0.0.0.0', () => {
    console.log(`🌸 Sakhi AI Backend server running on port ${portToTry}`);
    console.log(`📍 Local Health Check: http://localhost:${portToTry}/api/health`);
    console.log(`🌐 Network Access: http://10.124.139.5:${portToTry}/api/health`);
    console.log(`🔑 Gemini Key Status: ${process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('PASTE') ? 'Configured ✅' : 'Not configured (Add GEMINI_API_KEY to server/.env) ⚠️'}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const fallbackPort = Number(portToTry) + 1;
      console.warn(`⚠️ Port ${portToTry} is already in use (on macOS, AirPlay Receiver frequently occupies port 5000).`);
      console.warn(`💡 Tip: To free port 5000 on Mac: System Settings > General > AirDrop & AirPlay > Turn off AirPlay Receiver.`);
      console.warn(`🚀 Automatically starting Sakhi AI server on fallback port ${fallbackPort}...`);
      startServer(fallbackPort);
    } else {
      console.error('Fatal Server Listen Error:', err.message);
      process.exit(1);
    }
  });
}

startServer(PORT);
