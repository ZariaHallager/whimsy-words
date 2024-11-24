const mongoose = require('mongoose');

// Connect to MongoDB with updated options to avoid deprecation warnings
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, // Use the new URL string parser
    useUnifiedTopology: true, // Use the new server discovery and monitoring engine
});

const db = mongoose.connection;

// Log connection success
db.on('connected', function () {
    console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
});

// Log connection errors
db.on('error', function (err) {
    console.error('MongoDB connection error:', err);
});
