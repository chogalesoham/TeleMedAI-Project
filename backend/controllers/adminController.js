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

// ==================== DOCTOR APPROVAL MANAGEMENT ====================

// Get all pending doctors
exports.getPendingDoctors = async (req, res) => {
  try {
    const DoctorOnboarding = require('../models/DoctorOnboarding');

    // Find all doctors with pending approval status
    const pendingDoctors = await User.find({
      role: 'doctor',
      approvalStatus: 'pending'
    })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Enrich with onboarding data
    const enrichedDoctors = await Promise.all(
      pendingDoctors.map(async (doctor) => {
        const onboarding = await DoctorOnboarding.findOne({ userId: doctor._id }).lean();

        return {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          gender: doctor.gender,
          location: doctor.location,
          profilePicture: doctor.profilePicture,
          registrationNumber: onboarding?.medicalRegistrationNumber || 'N/A',
          registrationCouncil: onboarding?.registrationCouncil || 'N/A',
          specialties: onboarding?.specialties || [],
          languages: onboarding?.languages || [],
          consultationModes: onboarding?.consultationModes || [],
          consultationFee: onboarding?.consultationFee || null,
          verificationDocuments: onboarding?.verificationDocuments || [],
          onboardingCompleted: doctor.onboardingCompleted,
          createdAt: doctor.createdAt,
          approvalStatus: doctor.approvalStatus
        };
      })
    );

    res.json({
      success: true,
      data: {
        doctors: enrichedDoctors,
        total: enrichedDoctors.length
      }
    });
  } catch (error) {
    console.error('Error fetching pending doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending doctors',
      error: error.message
    });
  }
};

// Approve a doctor
exports.approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.userId;

    // Find doctor
    const doctor = await User.findOne({ _id: id, role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (doctor.approvalStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Doctor is already approved'
      });
    }

    // Update approval status
    doctor.isApproved = true;
    doctor.approvalStatus = 'approved';
    doctor.approvedBy = adminId;
    doctor.approvedAt = new Date();
    doctor.rejectionReason = '';

    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor approved successfully',
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        approvalStatus: doctor.approvalStatus,
        approvedAt: doctor.approvedAt
      }
    });
  } catch (error) {
    console.error('Error approving doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve doctor',
      error: error.message
    });
  }
};

// Reject a doctor
exports.rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.userId;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    // Find doctor
    const doctor = await User.findOne({ _id: id, role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (doctor.approvalStatus === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Doctor is already rejected'
      });
    }

    // Update approval status
    doctor.isApproved = false;
    doctor.approvalStatus = 'rejected';
    doctor.approvedBy = adminId;
    doctor.approvedAt = new Date();
    doctor.rejectionReason = reason;

    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor rejected successfully',
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        approvalStatus: doctor.approvalStatus,
        rejectionReason: doctor.rejectionReason
      }
    });
  } catch (error) {
    console.error('Error rejecting doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject doctor',
      error: error.message
    });
  }
};

// Get all doctors (approved, pending, rejected)
exports.getAllDoctors = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const DoctorOnboarding = require('../models/DoctorOnboarding');

    // Build query
    let query = { role: 'doctor' };

    if (status) {
      query.approvalStatus = status;
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get paginated doctors
    const doctors = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Enrich with onboarding data
    const enrichedDoctors = await Promise.all(
      doctors.map(async (doctor) => {
        const onboarding = await DoctorOnboarding.findOne({ userId: doctor._id }).lean();

        return {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          registrationNumber: onboarding?.medicalRegistrationNumber || 'N/A',
          specialties: onboarding?.specialties || [],
          approvalStatus: doctor.approvalStatus,
          isApproved: doctor.isApproved,
          onboardingCompleted: doctor.onboardingCompleted,
          createdAt: doctor.createdAt,
          approvedAt: doctor.approvedAt
        };
      })
    );

    res.json({
      success: true,
      data: {
        doctors: enrichedDoctors,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
};
