import Lecture from '../models/Lecture.js';
import Course from '../models/Course.js';

// @desc    Get all lectures for a specific course
// @route   GET /api/lectures/course/:courseId
// @access  Public
export const getLecturesByCourse = async (req, res, next) => {
    try {
        const lectures = await Lecture.find({ courseId: req.params.courseId });

        // Natural sort by title serial numbers
        lectures.sort((a, b) =>
            (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' })
        );

        res.json({
            success: true,
            count: lectures.length,
            data: lectures,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new lecture for a course
// @route   POST /api/lectures
// @access  Private/Admin
export const createLecture = async (req, res, next) => {
    try {
        const { title, description, videoUrl, courseId } = req.body;

        if (!title || !videoUrl || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Title, video URL, and course ID are required',
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Associated course not found',
            });
        }

        const lecture = await Lecture.create({
            title: title.trim(),
            description: description?.trim() || '',
            videoUrl: videoUrl.trim(),
            courseId: course._id,
        });

        res.status(201).json({
            success: true,
            message: 'Lecture created successfully',
            data: lecture,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update lecture details
// @route   PUT /api/lectures/:id
// @access  Private/Admin
export const updateLecture = async (req, res, next) => {
    try {
        const lecture = await Lecture.findById(req.params.id);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: 'Lecture not found',
            });
        }

        const { title, description, videoUrl } = req.body;

        if (title !== undefined) lecture.title = title.trim();
        if (description !== undefined) lecture.description = description.trim();
        if (videoUrl !== undefined) lecture.videoUrl = videoUrl.trim();

        const updatedLecture = await lecture.save();

        res.json({
            success: true,
            message: 'Lecture updated successfully',
            data: updatedLecture,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a lecture
// @route   DELETE /api/lectures/:id
// @access  Private/Admin
export const deleteLecture = async (req, res, next) => {
    try {
        const lecture = await Lecture.findById(req.params.id);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: 'Lecture not found',
            });
        }

        await Lecture.findByIdAndDelete(lecture._id);

        res.json({
            success: true,
            message: 'Lecture deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

