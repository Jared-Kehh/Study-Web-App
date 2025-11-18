// connect.cjs
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'config.env' });

const connectionString = process.env.MONGO_URI;
const client = new MongoClient(connectionString);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('study-timer'); // Your database name
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

module.exports = { connectDB, getDB };