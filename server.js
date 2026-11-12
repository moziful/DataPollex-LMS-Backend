import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import courseRoutes from './src/routes/courseRoutes.js';
import { errorHandler } from './src/middlewares/errorMiddleware.js';

const app = express();

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
    res.json({ success: true, message: 'DataPollex LMS API is running' });
});

// API Routes
app.use('/api/courses', courseRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});