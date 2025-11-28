const mongoose = require('mongoose');
const User = require('../models/User');
const DoctorOnboarding = require('../models/DoctorOnboarding');
const axios = require('axios');
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

// Function to get coordinates from city name using OpenStreetMap Nominatim API
const getCoordinates = async (city, state = '', country = 'India') => {
    try {
        const query = `${city}, ${state}, ${country}`;
        console.log(`Fetching coordinates for: ${query}`);

        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: query,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'TeleMedAI-Project/1.0' // Required by Nominatim
            }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return {
                lat: parseFloat(lat),
                lng: parseFloat(lon)
            };
        }
        return null;
    } catch (error) {
        console.error(`Geocoding error for ${city}:`, error.message);
        return null;
    }
};

// Sleep function to respect API rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const syncDoctors = async () => {
    await connectDB();

    try {
        // 1. Find all users with role 'doctor'
        const doctorUsers = await User.find({ role: 'doctor' });
        console.log(`Found ${doctorUsers.length} users with role 'doctor'.`);

        let createdCount = 0;
        let updatedCount = 0;

        for (const user of doctorUsers) {
            // 2. Check if they have an onboarding record
            let onboarding = await DoctorOnboarding.findOne({ userId: user._id });

            // Get location details from User model
            const city = user.location?.city || 'Mumbai';
            const state = user.location?.state || 'Maharashtra';
            const country = user.location?.country || 'India';

            // Fetch real coordinates
            let coordinates = null;
            if (city) {
                coordinates = await getCoordinates(city, state, country);
                // Wait 1 second between requests to be polite to the API
                await sleep(1000);
            }

            // Default to Mumbai if geocoding fails
            const lng = coordinates ? coordinates.lng : 72.8777;
            const lat = coordinates ? coordinates.lat : 19.0760;

            // Add a small random offset so doctors in the same city don't overlap exactly
            const latOffset = (Math.random() - 0.5) * 0.005;
            const lngOffset = (Math.random() - 0.5) * 0.005;

            const finalCoordinates = {
                type: 'Point',
                coordinates: [lng + lngOffset, lat + latOffset] // [lng, lat]
            };

            if (!onboarding) {
                // 3. Create missing onboarding record
                console.log(`Creating onboarding record for doctor: ${user.name} in ${city}`);

                const nameParts = user.name.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || '';

                onboarding = new DoctorOnboarding({
                    userId: user._id,
                    firstName: firstName,
                    lastName: lastName,
                    medicalRegistrationNumber: `REG-${Math.floor(Math.random() * 100000)}`,
                    specialties: ['General Practice'],
                    consultationModes: ['tele', 'in_person'],
                    languages: ['English'],
                    shortBio: `Experienced medical professional based in ${city}.`,
                    consultationFee: {
                        amount: 500,
                        currency: 'INR',
                        mode: 'per_consult'
                    },
                    clinicLocation: {
                        address: user.location?.city ? `${user.location.city}, ${user.location.state}` : 'Mumbai, India',
                        city: city,
                        state: state,
                        country: country,
                        zipCode: user.location?.zipCode || '',
                        coordinates: finalCoordinates
                    },
                    verificationStatus: 'verified',
                    onboardingProgress: {
                        isCompleted: true,
                        step1Completed: true,
                        step2Completed: true,
                        step3Completed: true,
                        step4Completed: true
                    }
                });
                createdCount++;
            } else {
                // 4. Update existing record with real coordinates
                console.log(`Updating coordinates for doctor: ${user.name} in ${city}`);

                onboarding.clinicLocation = {
                    ...onboarding.clinicLocation,
                    city: city,
                    state: state,
                    country: country,
                    coordinates: finalCoordinates
                };

                // Ensure verified status for map visibility
                onboarding.verificationStatus = 'verified';
                onboarding.onboardingProgress.isCompleted = true;

                updatedCount++;
            }

            await onboarding.save();
        }

        console.log(`Sync complete. Created: ${createdCount}, Updated: ${updatedCount}`);
        process.exit(0);
    } catch (error) {
        console.error('Error syncing doctors:', error);
        process.exit(1);
    }
};

syncDoctors();
