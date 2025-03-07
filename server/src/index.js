import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import financialRoutes from './routes/financial.js';
import taxRoutes from './routes/tax.js';
import expenseRoutes from './routes/expenses.js';
import regulatoryRoutes from './routes/regulatory.js';
import taxAssistantRoutes from './routes/taxAssistant.js';
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB
connectDB();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/regulatory', regulatoryRoutes);
app.use('/api/tax-assistant', taxAssistantRoutes);

// Gemini API endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    console.log('Gemini API Key:', apiKey); // Debugging

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    console.log("Prompt to Gemini: ", prompt);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt,
            }],
          }],
          generationConfig:{
            temperature: 0.7,
            maxOutputTokens: 500,
            topK: 40,
            topP: 0.95,
          }
        }),
      }
    );
    console.log("Gemini API Response:", response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', response.status, errorData);
      return res.status(400).json({ error: `Gemini API error: ${response.status} - ${JSON.stringify(errorData)}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Gemini API request error:', error);
    res.status(500).json({ error: 'Failed to retrieve data from Gemini API' });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// Add error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});