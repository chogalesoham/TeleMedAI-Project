const User = require('../models/User');
const PatientOnboarding = require('../models/PatientOnboarding');

// Get all patients with statistics
exports.getAllPatients = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { role: 'patient' };

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Add status filter
    if (status) {
      query.isActive = status === 'active';
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get paginated patients
    const patients = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Enrich patient data with onboarding info
    const enrichedPatients = await Promise.all(
      patients.map(async (patient) => {
        const onboarding = await PatientOnboarding.findOne({ userId: patient._id }).lean();
        
        // Calculate age from dateOfBirth
        const age = patient.dateOfBirth 
          ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
          : null;

        return {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          age: age,
          gender: patient.gender,
          location: patient.location,
          profilePicture: patient.profilePicture,
          lastVisit: patient.lastLogin,
          status: patient.isActive ? 'active' : 'inactive',
          onboardingCompleted: patient.onboardingCompleted,
          emailVerified: patient.isEmailVerified,
          createdAt: patient.createdAt,
          bloodGroup: onboarding?.basicHealthProfile?.bloodGroup || null,
        };
      })
    );

    res.json({
      success: true,
      data: {
        patients: enrichedPatients,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error: error.message
    });
  }
};

// Get patient statistics
exports.getPatientStats = async (req, res) => {
  try {
    // Total patients
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // Active patients (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activePatients = await User.countDocuments({
      role: 'patient',
      isActive: true,
      lastLogin: { $gte: thirtyDaysAgo }
    });

    // New patients this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonth = await User.countDocuments({
      role: 'patient',
      createdAt: { $gte: startOfMonth }
    });

    // Calculate average age
    const patientsWithAge = await User.aggregate([
      { $match: { role: 'patient', dateOfBirth: { $exists: true, $ne: null } } },
      {
        $project: {
          age: {
            $divide: [
              { $subtract: [new Date(), '$dateOfBirth'] },
              365.25 * 24 * 60 * 60 * 1000
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgAge: { $avg: '$age' }
        }
      }
    ]);

    const avgAge = patientsWithAge.length > 0 ? Math.round(patientsWithAge[0].avgAge) : 0;

    // Onboarding completion rate
    const completedOnboarding = await User.countDocuments({
      role: 'patient',
      onboardingCompleted: true
    });
    const onboardingCompletionRate = totalPatients > 0 
      ? Math.round((completedOnboarding / totalPatients) * 100) 
      : 0;

    res.json({
      success: true,
      data: {
        totalPatients,
        activePatients,
        newThisMonth,
        avgAge,
        onboardingCompletionRate,
        inactivePatients: totalPatients - activePatients
      }
    });
  } catch (error) {
    console.error('Error fetching patient stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient statistics',
      error: error.message
    });
  }
};

// Get single patient details
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find patient
    const patient = await User.findOne({ _id: id, role: 'patient' })
      .select('-password')
      .lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get onboarding data
    const onboarding = await PatientOnboarding.findOne({ userId: id }).lean();

    // Calculate age
    const age = patient.dateOfBirth 
      ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
      : null;

    // Build complete patient profile
    const patientProfile = {
      id: patient._id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: age,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      location: patient.location,
      profilePicture: patient.profilePicture,
      status: patient.isActive ? 'active' : 'inactive',
      onboardingCompleted: patient.onboardingCompleted,
      emailVerified: patient.isEmailVerified,
      joinDate: patient.createdAt,
      lastVisit: patient.lastLogin,
      
      // Health profile data from onboarding
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
      emergencyContacts: onboarding?.telemedicinePreferences?.emergencyContacts || null,
      
      // Onboarding progress
      onboardingProgress: onboarding?.onboardingProgress || null,
    };

    res.json({
      success: true,
      data: patientProfile
    });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient details',
      error: error.message
    });
  }
};

// Update patient status
exports.updatePatientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const patient = await User.findOneAndUpdate(
      { _id: id, role: 'patient' },
      { isActive },
      { new: true }
    ).select('-password');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient status updated successfully',
      data: patient
    });
  } catch (error) {
    console.error('Error updating patient status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update patient status',
      error: error.message
    });
  }
};
