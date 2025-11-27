import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Root welcome/info route (useful for platforms like Vercel)
app.get('/', (req, res) => {
  res.json({
    name: 'Employee Tracker API',
    status: 'ok',
    endpoints: {
      health: '/health',
      employees: '/employees',
      tasks: '/tasks'
    }
  });
});

app.get('/health', (req, res) => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ status: 'ok', db: states[mongoose.connection.readyState] || 'unknown' });
});

app.use('/employees', employeeRoutes);
app.use('/tasks', taskRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'NotFound', message: 'Route not found' });
});

// Centralized error handling
app.use(errorHandler);

export default app;
