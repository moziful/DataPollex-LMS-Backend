import express from 'express';

const router = express.Router();

// api/courses
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Courses API is working',
        data: [],
    });
});

export default router;

