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

const checkDoctors = async () => {
    await connectDB();
    try {
        const doctors = await DoctorOnboarding.find({});
        console.log(`Total doctors found: ${doctors.length}`);

        doctors.forEach(doc => {
            console.log(`\nDoctor: ${doc.firstName} ${doc.lastName}`);
            console.log(`City: ${doc.clinicLocation?.city}`);
            console.log(`Coordinates: ${JSON.stringify(doc.clinicLocation?.coordinates)}`);
            console.log(`Verification Status: ${doc.verificationStatus}`);
            console.log(`Onboarding Completed: ${doc.onboardingProgress?.isCompleted}`);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDoctors();
