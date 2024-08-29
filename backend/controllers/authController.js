import userModel from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../middleware/error.js';
import passport from 'passport';

// Normal Signup
export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcryptjs.hash(password, 12);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Save token in HTTP-only cookie and send in response body
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(201).json({ success: true, token, message: "Signup Successful" });
    } catch (error) {
        next(errorHandler(500, "Signup Failed"));
    }
};

// Normal Signin
export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return next(errorHandler(404, "User Not Found"));

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) return next(errorHandler(400, "Invalid Credentials"));

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Save token in HTTP-only cookie and send in response body
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ success: true, token, message: "Signin Successful" });
    } catch (error) {
        next(errorHandler(500, "Signin Failed"));
    }
};

// Sign-Out
export const signout = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Signed out successfully" });
};

// Google OAuth
export const google = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google OAuth Callback
export const googleCallback = (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Save token in HTTP-only cookie and send in response body
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect(`http://localhost:5173?token=${token}`);
};
