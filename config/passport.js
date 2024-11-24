const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Updated import
const User = require('../models/user');

// Using the Google OAuth2 strategy
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK // Make sure this matches your redirect URI
    },
    async function (accessToken, refreshToken, profile, cb) {
        try {
            // Check if the user already exists in the database
            let user = await User.findOne({ googleId: profile.id });
            if (user) return cb(null, user); // If user exists, pass them to the next middleware

            // If the user does not exist, create a new user
            user = await User.create({
                name: profile.displayName,
                googleId: profile.id,
                email: profile.emails[0].value, // Get the first email from profile
                avatar: profile.photos[0].value // Get the first photo from profile
            });

            return cb(null, user); // After creating the user, pass them to the next middleware
        } catch (err) {
            return cb(err); // If there's an error, pass it to the callback
        }
    }
));

// Serialize the user into the session (store user's ID in session)
passport.serializeUser(function (user, cb) {
    cb(null, user._id);
});

// Deserialize the user from the session (retrieve user data based on ID)
passport.deserializeUser(async function (userId, cb) {
    try {
        const user = await User.findById(userId);
        cb(null, user); // Return the user from the database
    } catch (err) {
        cb(err); // If there's an error retrieving the user, pass it to the callback
    }
});
