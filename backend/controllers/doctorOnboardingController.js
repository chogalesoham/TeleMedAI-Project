const DoctorOnboarding = require('../models/DoctorOnboarding');
const User = require('../models/User');

/**
 * Get Doctor Onboarding Status
 * GET /api/doctor/onboarding/status
 */
const getOnboardingStatus = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find onboarding data
        let onboarding = await DoctorOnboarding.findOne({ userId });

        if (!onboarding) {
            return res.status(200).json({
                success: true,
                data: {
                    exists: false,
                    progress: {
                        step1Completed: false,
                        step2Completed: false,
                        step3Completed: false,
                        step4Completed: false,
                        isCompleted: false,
                        currentStep: 1
                    }
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                exists: true,
                progress: onboarding.onboardingProgress,
                verificationStatus: onboarding.verificationStatus
            }
        });

    } catch (error) {
        console.error('Get onboarding status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get onboarding status',
            error: error.message
        });
    }
};

/**
 * Get Complete Doctor Onboarding Data
 * GET /api/doctor/onboarding/data
 */
const getOnboardingData = async (req, res) => {
    try {
        const userId = req.user.userId;

        const onboarding = await DoctorOnboarding.findOne({ userId });

        if (!onboarding) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding data not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: onboarding
        });

    } catch (error) {
        console.error('Get onboarding data error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get onboarding data',
            error: error.message
        });
    }
};

/**
 * Save/Update Doctor Onboarding Data for a Specific Step
 * POST /api/doctor/onboarding/save
 */
const saveOnboardingData = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { step, data } = req.body;

        if (!step || !data) {
            return res.status(400).json({
                success: false,
                message: 'Please provide step number and data'
            });
        }

        if (step < 1 || step > 4) {
            return res.status(400).json({
                success: false,
                message: 'Invalid step number. Must be between 1 and 4'
            });
        }

        // Find or create onboarding document
        let onboarding = await DoctorOnboarding.findOne({ userId });

        if (!onboarding) {
            onboarding = new DoctorOnboarding({ userId });
        }

        // Update data based on step
        switch (step) {
            case 1:
                // Step 1: Basic Info + Registration
                if (data.firstName) onboarding.firstName = data.firstName;
                if (data.lastName) onboarding.lastName = data.lastName;
                if (data.medicalRegistrationNumber) onboarding.medicalRegistrationNumber = data.medicalRegistrationNumber;
                if (data.registrationCouncil) onboarding.registrationCouncil = data.registrationCouncil;

                onboarding.onboardingProgress.step1Completed = true;
                onboarding.onboardingProgress.currentStep = 2;
                break;

            case 2:
                // Step 2: Professional Details
                if (data.specialties) onboarding.specialties = data.specialties;
                if (data.consultationModes) onboarding.consultationModes = data.consultationModes;
                if (data.languages) onboarding.languages = data.languages;
                if (data.shortBio) onboarding.shortBio = data.shortBio;
                if (data.profilePhoto !== undefined) onboarding.profilePhoto = data.profilePhoto;

                onboarding.onboardingProgress.step2Completed = true;
                onboarding.onboardingProgress.currentStep = 3;
                break;

            case 3:
                // Step 3: Availability + Fees
                if (data.availability) onboarding.availability = data.availability;
                if (data.consultationFee) {
                    onboarding.consultationFee = {
                        currency: data.consultationFee.currency || 'INR',
                        amount: data.consultationFee.amount,
                        mode: data.consultationFee.mode || 'per_consult'
                    };
                }

                onboarding.onboardingProgress.step3Completed = true;
                onboarding.onboardingProgress.currentStep = 4;
                break;

            case 4:
                // Step 4: Documents + Terms
                if (data.verificationDocuments) onboarding.verificationDocuments = data.verificationDocuments;
                if (data.termsAndConditionsSigned !== undefined) {
                    onboarding.termsAndConditionsSigned = data.termsAndConditionsSigned;
                }

                onboarding.onboardingProgress.step4Completed = true;
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid step number'
                });
        }

        // Check if onboarding is complete
        onboarding.checkOnboardingComplete();

        // Auto-verify for MVP if onboarding is complete
        if (onboarding.onboardingProgress.isCompleted) {
            onboarding.autoVerifyForMVP();

            // Update user onboarding status
            await User.findByIdAndUpdate(userId, { onboardingCompleted: true });
        }

        // Save onboarding data
        await onboarding.save();

        return res.status(200).json({
            success: true,
            message: `Step ${step} saved successfully`,
            data: {
                onboarding,
                progress: onboarding.onboardingProgress
            }
        });

    } catch (error) {
        console.error('Save onboarding data error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Medical registration number already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to save onboarding data',
            error: error.message
        });
    }
};

/**
 * Update Practice Details
 * PUT /api/doctor/onboarding/practice-details
 */
const updatePracticeDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { availability, consultationFee } = req.body;

        const onboarding = await DoctorOnboarding.findOne({ userId });

        if (!onboarding) {
            return res.status(404).json({
                success: false,
                message: 'Onboarding data not found. Please complete onboarding first.'
            });
        }

        // Update fields if provided
        if (availability) onboarding.availability = availability;
        if (consultationFee) onboarding.consultationFee = consultationFee;

        await onboarding.save();

        return res.status(200).json({
            success: true,
            message: 'Practice details updated successfully',
            data: onboarding
        });

    } catch (error) {
        console.error('Update practice details error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to update practice details',
            error: error.message
        });
    }
};

module.exports = {
    getOnboardingStatus,
    getOnboardingData,
    saveOnboardingData,
    updatePracticeDetails
};
