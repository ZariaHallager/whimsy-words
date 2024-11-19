require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Entry = require('./models/Entry');

const app = express();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
// Home route - list all entries
app.get('/', async (req, res) => {
    try {
        const entries = await Entry.find();
        res.render('index', { entries });
    } catch (err) {
        res.status(500).send('Error fetching entries.');
    }
});

// Create entry form
app.get('/create', (req, res) => {
    res.render('create');
});

// Handle new entry creation
app.post('/create', async (req, res) => {
    const { title, content } = req.body;
    try {
        const newEntry = new Entry({ title, content });
        await newEntry.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error creating entry.');
    }
});

// View single entry
app.get('/entry/:id', async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        res.render('entry', { entry });
    } catch (err) {
        res.status(404).send('Entry not found.');
    }
});

// Edit entry form
app.get('/entry/:id/edit', async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        res.render('edit', { entry });
    } catch (err) {
        res.status(404).send('Entry not found.');
    }
});

// Handle entry update
app.post('/entry/:id/edit', async (req, res) => {
    const { title, content } = req.body;
    try {
        await Entry.findByIdAndUpdate(req.params.id, { title, content });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error updating entry.');
    }
});

// Handle entry deletion
app.post('/entry/:id/delete', async (req, res) => {
    try {
        await Entry.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error deleting entry.');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
