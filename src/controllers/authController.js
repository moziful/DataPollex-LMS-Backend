import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

// Helper to sign JWT
const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'datapollex_secret_key', {
        expiresIn: '7d',
    });
};

// @desc    Authenticate admin or student & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password',
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 1. Check if user is an Admin
        const admin = await Admin.findOne({ email: normalizedEmail });
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            const token = signToken({
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: 'admin',
            });

            return res.json({
                success: true,
                message: 'Admin signed in successfully',
                token,
                user: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: 'admin',
                },
            });
        }

        // 2. Check if user is a Student / User
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            const token = signToken({
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role || 'student',
            });

            return res.json({
                success: true,
                message: 'Signed in successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'student',
                },
            });
        }

        // Neither admin nor user found
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long',
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if email already registered in Admin or User collections
        const [existingAdmin, existingUser] = await Promise.all([
            Admin.findOne({ email: normalizedEmail }),
            User.findOne({ email: normalizedEmail }),
        ]);

        if (existingAdmin || existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'student',
        });

        const token = signToken({
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            role: 'student',
        });

        return res.status(201).json({
            success: true,
            message: 'Student account created successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: 'student',
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get currently authenticated user details
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        return res.json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
};

