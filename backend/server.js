const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Hello World Route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World from TeleMedAI Backend API! 🏥',
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});



// Start Server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 TeleMedAI Backend Server Started!');
});

module.exports = app;
