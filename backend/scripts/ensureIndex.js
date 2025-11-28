const mongoose = require('mongoose');
const DoctorOnboarding = require('../models/DoctorOnboarding');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/telemedai');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const ensureIndex = async () => {
    await connectDB();
    try {
        console.log('Ensuring geospatial index...');

        // Drop existing indexes to be safe
        try {
            await DoctorOnboarding.collection.dropIndex('clinicLocation.coordinates_2dsphere');
            console.log('Dropped existing index');
        } catch (e) {
            console.log('No existing index to drop or drop failed:', e.message);
        }

        // Create index
        await DoctorOnboarding.collection.createIndex({ 'clinicLocation.coordinates': '2dsphere' });
        console.log('Created 2dsphere index on clinicLocation.coordinates');

        const indexes = await DoctorOnboarding.collection.indexes();
        console.log('Current Indexes:', indexes);

        process.exit(0);
    } catch (error) {
        console.error('Error ensuring index:', error);
        process.exit(1);
    }
};

ensureIndex();
