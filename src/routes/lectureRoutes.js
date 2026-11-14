import express from 'express';
import {
    getLecturesByCourse,
    createLecture,
    updateLecture,
    deleteLecture,
} from '../controllers/lectureController.js';
import { protect, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route to view course lectures
router.get('/course/:courseId', getLecturesByCourse);

// Protected Admin routes
router.post('/', protect, authorizeAdmin, createLecture);
router.put('/:id', protect, authorizeAdmin, updateLecture);
router.delete('/:id', protect, authorizeAdmin, deleteLecture);

export default router;

