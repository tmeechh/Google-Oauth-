import express from 'express';
import { signin, signup, google, googleCallback, signout } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

// Normal Auth
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);  // Sign-out route

// Google OAuth
router.get('/google', google);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);

export default router;
