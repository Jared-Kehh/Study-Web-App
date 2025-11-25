const express = require('express');
const cors = require('cors');
const { connectDB } = require('./connect.cjs');
const notesRoutes = require('./routes/notes.cjs');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(notesRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});