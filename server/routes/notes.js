const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../connect.cjs'); // Adjust path as needed

// Get all notes
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const notes = await db.collection('notes').find().sort({ updatedAt: -1 }).toArray();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, tags, createdAt, updatedAt } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const db = getDB();
    const result = await db.collection('notes').insertOne({
      title,
      content,
      tags: tags || [],
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    });

    const newNote = {
      _id: result.insertedId,
      title,
      content,
      tags: tags || [],
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    };

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, updatedAt } = req.body;

    const db = getDB();
    const result = await db.collection('notes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          title, 
          content, 
          tags: tags || [],
          updatedAt: new Date(updatedAt)
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const db = getDB();
    const result = await db.collection('notes').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Search notes
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json([]);
    }

    const db = getDB();
    const notes = await db.collection('notes').find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    }).sort({ updatedAt: -1 }).toArray();

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

module.exports = router;