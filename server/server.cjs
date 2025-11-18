const express = require('express');
const cors = require('cors');
const notesRoutes = require('./routes/notes.cjs'); // Adjust path as needed

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', notesRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});