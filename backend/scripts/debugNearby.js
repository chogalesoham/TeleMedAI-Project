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

const debugNearby = async () => {
    await connectDB();
    try {
        const query = {
            'onboardingProgress.isCompleted': true,
            'verificationStatus': 'verified'
        };

        console.log('Query:', JSON.stringify(query));

        const doctors = await DoctorOnboarding.find(query).lean();
        console.log(`Found ${doctors.length} doctors matching query.`);

        doctors.forEach(doc => {
            console.log(`\nDoctor ID: ${doc._id}`);
            console.log('clinicLocation:', JSON.stringify(doc.clinicLocation));

            const coords = doc.clinicLocation?.coordinates?.coordinates;
            console.log('Extracted coords:', coords);

            if (!coords || !Array.isArray(coords) || coords.length !== 2) {
                console.log('❌ INVALID COORDINATES');
            } else {
                console.log('✅ VALID COORDINATES');
            }
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugNearby();
