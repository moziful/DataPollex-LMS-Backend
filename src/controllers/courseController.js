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

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res, next) => {
    try {
        const { title, description, price, thumbnailUrl } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title and description are required',
            });
        }

        const course = await Course.create({
            title: title.trim(),
            description: description.trim(),
            price: Number(price) >= 0 ? Number(price) : 0,
            thumbnailUrl: thumbnailUrl?.trim() || '',
        });

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course details
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const { title, description, price, thumbnailUrl } = req.body;

        if (title !== undefined) course.title = title.trim();
        if (description !== undefined) course.description = description.trim();
        if (price !== undefined) course.price = Number(price) >= 0 ? Number(price) : 0;
        if (thumbnailUrl !== undefined) course.thumbnailUrl = thumbnailUrl.trim();

        const updatedCourse = await course.save();

        res.json({
            success: true,
            message: 'Course updated successfully',
            data: updatedCourse,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a course and cascade its lectures
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Cascade delete: remove all associated lectures
        await Lecture.deleteMany({ courseId: course._id });

        // Delete the course itself
        await Course.findByIdAndDelete(course._id);

        res.json({
            success: true,
            message: 'Course and associated lectures deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
