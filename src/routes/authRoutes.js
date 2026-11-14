import express from 'express';
import { login, register, getMe, updateProgress, updateProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);
router.put('/progress', protect, updateProgress);
router.put('/profile', protect, updateProfile);

export default router;

