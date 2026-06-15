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

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Amanvi AI Backend is running' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/webhooks', webhookRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/amanvi-ai';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
