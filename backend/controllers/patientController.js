const User = require('../models/User');
const PatientOnboarding = require('../models/PatientOnboarding');
const DoctorOnboarding = require('../models/DoctorOnboarding');

/**
 * Get all approved doctors for patient selection
 * GET /api/patient/doctors
 */
exports.getApprovedDoctors = async (req, res) => {
    try {
        const { specialization, search, sortBy = 'rating' } = req.query;

        // Build query for approved doctors only
        let query = {
            role: 'doctor',
            isApproved: true,
            approvalStatus: 'approved',
            isActive: true,
            onboardingCompleted: true
        };

        // Get approved doctors
        const doctors = await User.find(query)
            .select('-password')
            .lean();

        // Enrich with onboarding data
        const enrichedDoctors = await Promise.all(
            doctors.map(async (doctor) => {
                const onboarding = await DoctorOnboarding.findOne({ userId: doctor._id }).lean();

                if (!onboarding) return null; // Skip doctors without onboarding data

                // Filter by specialization if provided
                if (specialization && specialization !== 'all') {
                    if (!onboarding.specialties?.includes(specialization)) {
                        return null;
                    }
                }

                // Filter by search query
                if (search) {
                    const searchLower = search.toLowerCase();
                    const matchesName = doctor.name.toLowerCase().includes(searchLower);
                    const matchesSpecialty = onboarding.specialties?.some(s =>
                        s.toLowerCase().includes(searchLower)
                    );
                    if (!matchesName && !matchesSpecialty) {
                        return null;
                    }
                }

                return {
                    id: doctor._id,
                    name: doctor.name,
                    email: doctor.email,
                    phone: doctor.phone,
                    gender: doctor.gender,
                    profilePicture: onboarding.profilePhoto || doctor.profilePicture || '',
                    registrationNumber: onboarding.medicalRegistrationNumber || '',
                    registrationCouncil: onboarding.registrationCouncil || '',
                    specialties: onboarding.specialties || [],
                    languages: onboarding.languages || [],
                    consultationModes: onboarding.consultationModes || [],
                    consultationFee: onboarding.consultationFee || { currency: 'INR', amount: 0, mode: 'per_consult' },
                    shortBio: onboarding.shortBio || '',
                    availability: onboarding.availability || [],
                    verificationStatus: onboarding.verificationStatus || 'pending',
                    // Mock rating for now (can be calculated from reviews later)
                    rating: 4.5,
                    reviewCount: 0,
                    experience: 5 // Can be calculated from registration date or added to onboarding
                };
            })
        );

        // Filter out null values
        const validDoctors = enrichedDoctors.filter(d => d !== null);

        // Sort doctors
        validDoctors.sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price') return a.consultationFee.amount - b.consultationFee.amount;
            if (sortBy === 'experience') return b.experience - a.experience;
            return 0;
        });

        res.json({
            success: true,
            data: {
                doctors: validDoctors,
                total: validDoctors.length
            }
        });
    } catch (error) {
        console.error('Error fetching approved doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors',
            error: error.message
        });
    }
};

/**
 * Get patient profile with onboarding data
 * GET /api/patient/profile
 */
exports.getPatientProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get user data
        const user = await User.findById(userId).select('-password').lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get onboarding data
        const onboarding = await PatientOnboarding.findOne({ userId }).lean();

        // Calculate age
        const age = user.dateOfBirth
            ? Math.floor((new Date() - new Date(user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
            : null;

        // Build complete profile
        const profile = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            age,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            location: user.location,
            profilePicture: user.profilePicture,
            onboardingCompleted: user.onboardingCompleted,

            // Health profile
            healthProfile: onboarding?.basicHealthProfile ? {
                height: onboarding.basicHealthProfile.height,
                weight: onboarding.basicHealthProfile.weight,
                bmi: onboarding.basicHealthProfile.bmi,
                bloodGroup: onboarding.basicHealthProfile.bloodGroup,
            } : null,

            // Medical history
            medicalHistory: onboarding?.medicalHistory || null,

            // Current health status
            currentHealthStatus: onboarding?.currentHealthStatus || null,

            // Emergency contacts
            emergencyContacts: onboarding?.telemedicinePreferences?.emergencyContacts || [],

            // Onboarding progress
            onboardingProgress: onboarding?.onboardingProgress || null,
        };

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
};

/**
 * Get doctor details by ID (for patient view)
 * GET /api/patient/doctors/:id
 */
exports.getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find doctor
        const doctor = await User.findOne({
            _id: id,
            role: 'doctor',
            isApproved: true,
            approvalStatus: 'approved'
        }).select('-password').lean();

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found or not approved'
            });
        }

        // Get onboarding data
        const onboarding = await DoctorOnboarding.findOne({ userId: id }).lean();

        if (!onboarding) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile incomplete'
            });
        }

        // Build complete doctor profile
        const doctorProfile = {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            gender: doctor.gender,
            profilePicture: onboarding.profilePhoto || doctor.profilePicture || '',
            registrationNumber: onboarding.medicalRegistrationNumber,
            registrationCouncil: onboarding.registrationCouncil,
            specialties: onboarding.specialties,
            languages: onboarding.languages,
            consultationModes: onboarding.consultationModes,
            consultationFee: onboarding.consultationFee,
            shortBio: onboarding.shortBio,
            availability: onboarding.availability,
            verificationStatus: onboarding.verificationStatus,
            // Mock data for now
            rating: 4.5,
            reviewCount: 0,
            experience: 5
        };

        res.json({
            success: true,
            data: doctorProfile
        });
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor details',
            error: error.message
        });
    }
};
