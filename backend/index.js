import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session'; // Import express-session
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from './models/userModel.js';
import authRouter from './routes/authRoute.js';

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO)
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log(err));

app.use(cors());
app.use(express.json()); 
app.use(cookieParser());

// Configure session middleware before initializing Passport
app.use(session({
    secret: process.env.JWT_SECRET, // You can use a different secret for sessions
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

// Initialize Passport.js middleware
app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login sessions

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
      try {
          // Check if the user already exists in the database
          const existingUser = await userModel.findOne({ googleId: profile.id });
          if (existingUser) {
              return done(null, existingUser);
          }
          // If not, create a new user
          const newUser = new userModel({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
          });
          await newUser.save();
          done(null, newUser);
      } catch (error) {
          done(error, false);
      }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

// Routes
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Start server
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
