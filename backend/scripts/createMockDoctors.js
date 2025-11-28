const mongoose = require('mongoose');
const DoctorOnboarding = require('../models/DoctorOnboarding');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
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

const createMockDoctors = async () => {
    await connectDB();

    try {
        console.log('Creating mock doctors...');

        // Mock data
        const mockDoctors = [
            {
                name: 'Dr. Sarah Smith',
                email: 'sarah.smith@example.com',
                specialty: 'Cardiology',
                lat: 19.0760 + 0.01,
                lng: 72.8777 + 0.01
            },
            {
                name: 'Dr. John Doe',
                email: 'john.doe@example.com',
                specialty: 'Dermatology',
                lat: 19.0760 - 0.01,
                lng: 72.8777 - 0.01
            },
            {
                name: 'Dr. Emily Chen',
                email: 'emily.chen@example.com',
                specialty: 'Pediatrics',
                lat: 19.0760 + 0.02,
                lng: 72.8777 - 0.01
            }
        ];

        for (const doc of mockDoctors) {
            // 1. Create User
            let user = await User.findOne({ email: doc.email });
            if (!user) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('password123', salt);

                user = new User({
                    name: doc.name,
                    email: doc.email,
                    password: hashedPassword, // 'password123'
                    phone: '1234567890',
                    dateOfBirth: new Date('1980-01-01'),
                    gender: 'Female',
                    role: 'doctor',
                    onboardingCompleted: true,
                    isEmailVerified: true,
                    approvalStatus: 'approved'
                });
                await user.save();
                console.log(`Created user: ${doc.name}`);
            }

            // 2. Create Doctor Profile
            let doctorProfile = await DoctorOnboarding.findOne({ userId: user._id });
            if (!doctorProfile) {
                doctorProfile = new DoctorOnboarding({
                    userId: user._id,
                    firstName: doc.name.split(' ')[1],
                    lastName: doc.name.split(' ')[2],
                    medicalRegistrationNumber: `REG${Math.floor(Math.random() * 10000)}`,
                    specialties: [doc.specialty],
                    consultationModes: ['tele', 'in_person'],
                    languages: ['English', 'Hindi'],
                    shortBio: `Experienced ${doc.specialty} specialist with over 10 years of practice.`,
                    consultationFee: {
                        amount: 500 + Math.floor(Math.random() * 1000),
                        currency: 'INR',
                        mode: 'per_consult'
                    },
                    clinicLocation: {
                        address: '123 Health St',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        zipCode: '400001',
                        coordinates: {
                            type: 'Point',
                            coordinates: [doc.lng, doc.lat]
                        }
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
                await doctorProfile.save();
                console.log(`Created doctor profile for: ${doc.name}`);
            } else {
                console.log(`Doctor profile already exists for: ${doc.name}`);
            }
        }

        console.log('Mock doctors creation complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating mock doctors:', error);
        process.exit(1);
    }
};

createMockDoctors();
