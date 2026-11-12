import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Lecture title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        videoUrl: {
            type: String,
            required: [true, 'Video URL is required'],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Lecture = mongoose.model('Lecture', lectureSchema);
export default Lecture;

