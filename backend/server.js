const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Routes
const authRoutes = require('./routes/auth');
const onboardingRoutes = require('./routes/onboarding');

app.use('/api/auth', authRoutes);
app.use('/api/patient/onboarding', onboardingRoutes);

// Start Server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 TeleMedAI Backend Server Started!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});

module.exports = app;
