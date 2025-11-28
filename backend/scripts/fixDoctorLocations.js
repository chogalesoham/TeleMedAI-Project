const mongoose = require('mongoose');
const axios = require('axios');
const User = require('../models/User');
const DoctorOnboarding = require('../models/DoctorOnboarding');
require('dotenv').config();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getCoordinates(city) {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: city,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'TeleMedAI/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lon: parseFloat(response.data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error(`Error geocoding ${city}:`, error.message);
        return null;
    }
}

async function fixDoctorLocations() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/telemedai');
        console.log('✅ Connected to MongoDB');

        // Find all doctor users
        const doctorUsers = await User.find({ role: 'doctor' });
        console.log(`\n📋 Found ${doctorUsers.length} doctor users`);

        for (const user of doctorUsers) {
            console.log(`\n👨‍⚕️ Processing: ${user.name}`);

            // Find or create onboarding record
            let onboarding = await DoctorOnboarding.findOne({ userId: user._id });

            if (!onboarding) {
                console.log('  Creating new onboarding record...');
                onboarding = new DoctorOnboarding({
                    userId: user._id,
                    firstName: user.name.split(' ')[0] || 'Doctor',
                    lastName: user.name.split(' ').slice(1).join(' ') || 'User',
                    specialties: ['General Medicine'],
                    consultationModes: ['tele', 'in_person'],
                    languages: ['English', 'Hindi'],
                    consultationFee: {
                        currency: 'INR',
                        amount: 500,
                        mode: 'per_consult'
                    }
                });
            }

            // Get city from user location
            const city = user.location?.city || 'Mumbai';
            console.log(`  City: ${city}`);

            // Get coordinates
            console.log(`  Fetching coordinates...`);
            const coords = await getCoordinates(city);
            await sleep(1000); // Rate limit

            if (coords) {
                console.log(`  Coordinates: ${coords.lat}, ${coords.lon}`);

                // Set clinic location
                onboarding.clinicLocation = {
                    address: user.location?.address || `${city} Clinic`,
                    city: city,
                    state: user.location?.state || 'Maharashtra',
                    zipCode: user.location?.zipCode || '400001',
                    coordinates: {
                        type: 'Point',
                        coordinates: [coords.lon, coords.lat] // [longitude, latitude]
                    }
                };

                // Mark as verified and completed
                onboarding.verificationStatus = 'verified';
                onboarding.onboardingProgress = {
                    step1Completed: true,
                    step2Completed: true,
                    step3Completed: true,
                    step4Completed: true,
                    isCompleted: true,
                    currentStep: 4
                };

                await onboarding.save();
                console.log('  ✅ Saved successfully');
            } else {
                console.log('  ❌ Could not get coordinates');
            }
        }

        console.log('\n✅ All doctors processed!');

        // Verify the data
        const verifiedDoctors = await DoctorOnboarding.find({
            'verificationStatus': 'verified',
            'onboardingProgress.isCompleted': true
        });

        console.log(`\n📊 Verified doctors in database: ${verifiedDoctors.length}`);
        verifiedDoctors.forEach(doc => {
            console.log(`  - Dr. ${doc.firstName} ${doc.lastName} in ${doc.clinicLocation?.city}`);
            console.log(`    Coords: ${doc.clinicLocation?.coordinates?.coordinates}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixDoctorLocations();
