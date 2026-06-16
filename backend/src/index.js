import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

import userRoutes from './routes/userRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import inboxRoutes from './routes/inboxRoutes.js';
import { initializeWhatsApp } from './services/whatsappService.js';

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Amanvi AI Backend is running' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/inbox', inboxRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/amanvi-ai';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error (Ignored for now):', error.message);
  });

// Initialize WhatsApp Web Client unconditionally
try {
  initializeWhatsApp();
} catch (e) {
  console.error("Failed to initialize WhatsApp", e);
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
