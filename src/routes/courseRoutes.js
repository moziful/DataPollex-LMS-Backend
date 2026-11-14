import express from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
} from '../controllers/courseController.js';
import { protect, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected Admin routes
router.post('/', protect, authorizeAdmin, createCourse);
router.put('/:id', protect, authorizeAdmin, updateCourse);
router.delete('/:id', protect, authorizeAdmin, deleteCourse);

export default router;
