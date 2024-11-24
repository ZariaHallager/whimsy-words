const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect to Google for authentication
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth2 callback
router.get('/oauth2callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // On successful login, redirect to the journal entries page or dashboard
        res.redirect('/');
    }
);

// Logout the user and redirect to home page
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        res.redirect('/');
    });
});

module.exports = router;
