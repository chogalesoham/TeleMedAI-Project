const mongoose = require('mongoose');
const DoctorOnboarding = require('../models/DoctorOnboarding');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/telemedai', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const seedLocations = async () => {
    await connectDB();

    try {
        const doctors = await DoctorOnboarding.find({});
        console.log(`Found ${doctors.length} doctors.`);

        // Center point (Mumbai)
        const centerLat = 19.0760;
        const centerLng = 72.8777;

        for (const doctor of doctors) {
            // Generate random offset for location (within ~10km)
            const latOffset = (Math.random() - 0.5) * 0.1;
            const lngOffset = (Math.random() - 0.5) * 0.1;

            doctor.clinicLocation = {
                address: '123 Medical Center Road',
                city: 'Mumbai',
                state: 'Maharashtra',
                country: 'India',
                zipCode: '400001',
                coordinates: {
                    type: 'Point',
                    coordinates: [centerLng + lngOffset, centerLat + latOffset] // [lng, lat]
                }
            };

            // Ensure other required fields for the query are set
            if (!doctor.verificationStatus) doctor.verificationStatus = 'verified';
            if (!doctor.onboardingProgress) doctor.onboardingProgress = {};
            doctor.onboardingProgress.isCompleted = true;

            await doctor.save();
            console.log(`Updated location for Dr. ${doctor.firstName} ${doctor.lastName}`);
        }

        console.log('All doctors updated with mock locations.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding locations:', error);
        process.exit(1);
    }
};

seedLocations();
