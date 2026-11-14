import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

// Verify JWT token from Authorization header
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, session token missing',
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'datapollex_secret_key'
        );

        // Fetch user or admin doc to attach to req
        if (decoded.role === 'admin') {
            const admin = await Admin.findById(decoded.id).select('-password');
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Admin account not found or removed',
                });
            }
            req.user = {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin',
            };
        } else {
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User account not found or removed',
                });
            }
            req.user = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'student',
            };
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, session token is invalid or expired',
        });
    }
};

// Restrict route strictly to Admins
export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Administrator privileges required',
        });
    }
    next();
};

