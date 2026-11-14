import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import courseRoutes from './src/routes/courseRoutes.js';
import lectureRoutes from './src/routes/lectureRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { errorHandler } from './src/middlewares/errorMiddleware.js';

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'DataPollex Academy API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
