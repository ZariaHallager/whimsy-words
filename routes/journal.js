const express = require('express');
const router = express.Router();
// You'll be creating this controller module next
const journalCtrl = require('../controller/journal');


// GET /expenses
router.get('/', journalCtrl.index);
// GET /expenses/new
router.get('/new', journalCtrl.new);

router.post('/', journalCtrl.create);

router.get('/:id/edit', journalCtrl.edit);

router.get('/:id', journalCtrl.show);

router.delete('/:id', journalCtrl.delete);

router.put('/:id', journalCtrl.update);

module.exports = router;


