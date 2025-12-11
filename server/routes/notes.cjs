const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');

// All note routes require authentication
router.use(authMiddleware);

// GET all notes for logged-in user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

// CREATE new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = new Note({
      userId: req.userId,
      title,
      content
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Error creating note' });
  }
});

// UPDATE note
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;

    // Find note and verify it belongs to the user
    const note = await Note.findOne({ _id: id, userId: req.userId });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.updatedAt = Date.now();

    await note.save();
    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Error updating note' });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete note, verify it belongs to the user
    const note = await Note.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully', id });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Error deleting note' });
  }
});

module.exports = router;