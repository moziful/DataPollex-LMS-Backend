import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            enum: ['student', 'user'],
            default: 'student',
        },
        lastProgress: {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            },
            courseTitle: {
                type: String,
                default: '',
            },
            courseThumbnail: {
                type: String,
                default: '',
            },
            lectureId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lecture',
            },
            lectureTitle: {
                type: String,
                default: '',
            },
            lectureIndex: {
                type: Number,
                default: 0,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
export default User;

