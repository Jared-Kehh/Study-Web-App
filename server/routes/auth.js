const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// VERIFY TOKEN (optional - for checking if user is still logged in)
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying token' });
  }
});

module.exports = router;