import Course from '../models/Course.js';
import Lecture from '../models/Lecture.js';

// @desc    Get all courses with lecture counts (last added course first)
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1, _id: -1 }).lean();

        const coursesWithLectures = await Promise.all(
            courses.map(async (course) => {
                const lecturesCount = await Lecture.countDocuments({ courseId: course._id });
                return {
                    ...course,
                    lecturesCount,
                };
            })
        );

        res.json({
            success: true,
            count: coursesWithLectures.length,
            data: coursesWithLectures,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single course by ID with lectures
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const lectures = await Lecture.find({ courseId: course._id });

        // Natural sort by title serial numbers (e.g. 01, 02 ... 10, or Lecture 1, 2 ... 10)
        lectures.sort((a, b) =>
            (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' })
        );

        res.json({
            success: true,
            data: {
                ...course.toObject(),
                lectures,
            },
        });
    } catch (error) {
        next(error);
    }
};

