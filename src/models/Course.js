import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Course title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Course description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Course price is required'],
            min: [0, 'Price must be 0 or greater'],
        },
        thumbnailUrl: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;

