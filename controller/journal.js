const Journal = require('../models/journalEntry');

// Index: Get all journal entries
const index = async (req, res) => {
    try {
        const journals = await Journal.find({});
        console.log('journals', journals);
        res.render('journal/index', { title: "My Journal", journals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Show: Get a specific journal entry by ID
const show = async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);
        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        console.log('journal', journal);
        res.render('journal/show', { title: journal.title, journal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// New: Render form for creating a new journal entry
const newEntry = (req, res) => {
    res.render('journal/new', { title: "Add New Entry", errorMsg: "" });
};

// Create: Add a new journal entry
const create = async (req, res) => {
    try {
        const journal = new Journal(req.body);
        await journal.save();
        res.redirect('/journal');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit: Render form for editing an existing journal entry
const edit = async (req, res) => {
    try {
        const journal = await Journal.findById(req.params.id);
        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.render('journal/edit', { title: "Edit Entry", journal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update: Update an existing journal entry by ID
const update = async (req, res) => {
    try {
        const journal = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.redirect('/journal');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete: Delete a journal entry by ID
const deleteJournal = async (req, res) => {
    try {
        const journal = await Journal.findByIdAndDelete(req.params.id);
        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.redirect('/journal'); // Redirect to the list of journal entries
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    index,
    new: newEntry,
    show,
    create,
    update,
    delete: deleteJournal,
    edit
};
