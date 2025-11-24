const PatientOnboarding = require('../models/PatientOnboarding');

/**
 * Get onboarding status for logged-in patient
 * GET /api/patient/onboarding/status
 */
const getOnboardingStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find onboarding record for user
    let onboarding = await PatientOnboarding.findOne({ userId });
    
    if (!onboarding) {
      return res.status(200).json({
        success: true,
        data: {
          exists: false,
          isCompleted: false,
          currentStep: 1,
          progress: {
            step1Completed: false,
            step2Completed: false,
            step3Completed: false,
            step4Completed: false
          }
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        exists: true,
        isCompleted: onboarding.onboardingProgress.isCompleted,
        currentStep: onboarding.onboardingProgress.currentStep,
        progress: {
          step1Completed: onboarding.onboardingProgress.step1Completed,
          step2Completed: onboarding.onboardingProgress.step2Completed,
          step3Completed: onboarding.onboardingProgress.step3Completed,
          step4Completed: onboarding.onboardingProgress.step4Completed
        },
        completedAt: onboarding.onboardingProgress.completedAt,
        onboardingData: onboarding
      }
    });
    
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch onboarding status',
      error: error.message
    });
  }
};

/**
 * Save/Update onboarding data (supports upsert)
 * POST /api/patient/onboarding/save
 */
const saveOnboardingData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { step, data } = req.body;
    
    // Validate step number
    if (!step || step < 1 || step > 4) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step number. Must be between 1 and 4.'
      });
    }
    
    // Find or create onboarding record
    let onboarding = await PatientOnboarding.findOne({ userId });
    
    if (!onboarding) {
      onboarding = new PatientOnboarding({ userId });
    }
    
    // Update data based on step
    switch (step) {
      case 1:
        onboarding.basicHealthProfile = {
          ...onboarding.basicHealthProfile,
          ...data
        };
        onboarding.onboardingProgress.step1Completed = true;
        onboarding.onboardingProgress.currentStep = Math.max(onboarding.onboardingProgress.currentStep, 2);
        break;
        
      case 2:
        onboarding.medicalHistory = {
          ...onboarding.medicalHistory,
          ...data
        };
        onboarding.onboardingProgress.step2Completed = true;
        onboarding.onboardingProgress.currentStep = Math.max(onboarding.onboardingProgress.currentStep, 3);
        break;
        
      case 3:
        // Merge arrays properly for medications and allergies
        if (data.currentMedications) {
          onboarding.currentHealthStatus.currentMedications = data.currentMedications;
        }
        if (data.allergies) {
          onboarding.currentHealthStatus.allergies = data.allergies;
        }
        // Simple string fields
        if (data.smokingStatus !== undefined) {
          onboarding.currentHealthStatus.smokingStatus = data.smokingStatus;
        }
        if (data.alcoholConsumption !== undefined) {
          onboarding.currentHealthStatus.alcoholConsumption = data.alcoholConsumption;
        }
        if (data.exerciseFrequency !== undefined) {
          onboarding.currentHealthStatus.exerciseFrequency = data.exerciseFrequency;
        }
        if (data.dietType !== undefined) {
          onboarding.currentHealthStatus.dietType = data.dietType;
        }
        if (data.sleepHours !== undefined) {
          if (!onboarding.currentHealthStatus.sleepHours) {
            onboarding.currentHealthStatus.sleepHours = {};
          }
          onboarding.currentHealthStatus.sleepHours.average = data.sleepHours;
        }
        
        onboarding.onboardingProgress.step3Completed = true;
        onboarding.onboardingProgress.currentStep = Math.max(onboarding.onboardingProgress.currentStep, 4);
        break;
        
      case 4:
        // Step 4: Emergency Contacts
        // Initialize telemedicinePreferences if it doesn't exist
        if (!onboarding.telemedicinePreferences) {
          onboarding.telemedicinePreferences = {};
        }
        if (!onboarding.telemedicinePreferences.emergencyContacts) {
          onboarding.telemedicinePreferences.emergencyContacts = {};
        }
        
        // Save primary contact
        if (data.primaryContact) {
          onboarding.telemedicinePreferences.emergencyContacts.primaryContact = {
            name: data.primaryContact.name || '',
            relationship: data.primaryContact.relationship || '',
            phone: data.primaryContact.phone || '',
            alternatePhone: data.primaryContact.alternatePhone || '',
            email: data.primaryContact.email || '',
            address: data.primaryContact.address || ''
          };
        }
        
        // Save secondary contact (optional)
        if (data.secondaryContact) {
          onboarding.telemedicinePreferences.emergencyContacts.secondaryContact = {
            name: data.secondaryContact.name || '',
            relationship: data.secondaryContact.relationship || '',
            phone: data.secondaryContact.phone || '',
            alternatePhone: data.secondaryContact.alternatePhone || '',
            email: data.secondaryContact.email || '',
            address: data.secondaryContact.address || ''
          };
        } else {
          // Remove secondary contact if not provided
          onboarding.telemedicinePreferences.emergencyContacts.secondaryContact = undefined;
        }
        
        onboarding.onboardingProgress.step4Completed = true;
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid step'
        });
    }
    
    // Check if onboarding is complete
    onboarding.checkOnboardingComplete();
    
    // Save to database
    await onboarding.save();
    
    return res.status(200).json({
      success: true,
      message: `Step ${step} saved successfully`,
      data: {
        currentStep: onboarding.onboardingProgress.currentStep,
        isCompleted: onboarding.onboardingProgress.isCompleted,
        progress: {
          step1Completed: onboarding.onboardingProgress.step1Completed,
          step2Completed: onboarding.onboardingProgress.step2Completed,
          step3Completed: onboarding.onboardingProgress.step3Completed,
          step4Completed: onboarding.onboardingProgress.step4Completed
        }
      }
    });
    
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({
      success: false,
      message: 'Failed to save onboarding data',
      error: error.message,
      details: error.toString()
    });
  }
};

/**
 * Get complete onboarding data
 * GET /api/patient/onboarding/data
 */
const getOnboardingData = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const onboarding = await PatientOnboarding.findOne({ userId });
    
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
    console.error('Error fetching onboarding data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch onboarding data',
      error: error.message
    });
  }
};

/**
 * Update medical information (ALL onboarding fields)
 * PUT /api/patient/onboarding/medical-info
 */
const updateMedicalInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      // Basic Health Profile
      height,
      weight,
      bloodGroup,
      
      // Medical History
      allergies,
      chronicConditions,
      previousSurgeries,
      familyHistory,
      
      // Current Health Status
      currentMedications,
      smokingStatus,
      alcoholConsumption,
      exerciseFrequency,
      dietType,
      sleepHours,
      
      // Emergency Contacts
      emergencyContacts
    } = req.body;

    // Find onboarding record
    let onboarding = await PatientOnboarding.findOne({ userId });
    
    if (!onboarding) {
      return res.status(404).json({
        success: false,
        message: 'Onboarding data not found. Please complete onboarding first.'
      });
    }

    // Update Basic Health Profile
    if (height !== undefined) {
      onboarding.basicHealthProfile.height = height;
    }
    if (weight !== undefined) {
      onboarding.basicHealthProfile.weight = weight;
      // Calculate BMI if both height and weight available
      if (onboarding.basicHealthProfile.height?.value && weight?.value) {
        const heightInMeters = onboarding.basicHealthProfile.height.unit === 'cm' 
          ? onboarding.basicHealthProfile.height.value / 100 
          : onboarding.basicHealthProfile.height.value * 0.3048;
        const weightInKg = weight.unit === 'kg' ? weight.value : weight.value * 0.453592;
        onboarding.basicHealthProfile.bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      }
    }
    if (bloodGroup !== undefined) {
      onboarding.basicHealthProfile.bloodGroup = bloodGroup;
    }

    // Update Medical History - Allergies
    if (allergies !== undefined) {
      onboarding.currentHealthStatus.allergies = allergies.map(allergen => ({
        allergen: typeof allergen === 'string' ? allergen : allergen.allergen,
        reaction: allergen.reaction || '',
        severity: allergen.severity || 'Moderate'
      }));
    }

    // Update Medical History - Chronic Conditions
    if (chronicConditions !== undefined) {
      onboarding.medicalHistory.chronicDiseases = chronicConditions.map(condition => ({
        name: typeof condition === 'string' ? condition : condition.name,
        diagnosedYear: condition.diagnosedYear || null,
        notes: condition.notes || ''
      }));
    }

    // Update Previous Surgeries
    if (previousSurgeries !== undefined) {
      onboarding.medicalHistory.previousSurgeries = previousSurgeries;
    }

    // Update Family History
    if (familyHistory !== undefined) {
      onboarding.medicalHistory.familyMedicalHistory = familyHistory;
    }

    // Update Current Medications
    if (currentMedications !== undefined) {
      onboarding.currentHealthStatus.currentMedications = currentMedications;
    }

    // Update Lifestyle - Smoking
    if (smokingStatus !== undefined) {
      onboarding.currentHealthStatus.smokingStatus = smokingStatus.status || smokingStatus;
      if (smokingStatus.details) {
        onboarding.currentHealthStatus.smokingDetails = smokingStatus.details;
      }
    }

    // Update Lifestyle - Alcohol
    if (alcoholConsumption !== undefined) {
      onboarding.currentHealthStatus.alcoholConsumption = alcoholConsumption.status || alcoholConsumption;
      if (alcoholConsumption.details) {
        onboarding.currentHealthStatus.alcoholDetails = alcoholConsumption.details;
      }
    }

    // Update Lifestyle - Exercise
    if (exerciseFrequency !== undefined) {
      onboarding.currentHealthStatus.exerciseFrequency = exerciseFrequency.frequency || exerciseFrequency;
      if (exerciseFrequency.types) {
        onboarding.currentHealthStatus.exerciseType = exerciseFrequency.types;
      }
    }

    // Update Lifestyle - Diet
    if (dietType !== undefined) {
      onboarding.currentHealthStatus.dietType = dietType;
    }

    // Update Lifestyle - Sleep
    if (sleepHours !== undefined) {
      onboarding.currentHealthStatus.sleepHours = sleepHours;
    }

    // Update Emergency Contacts
    if (emergencyContacts !== undefined && Array.isArray(emergencyContacts)) {
      const [primary, secondary] = emergencyContacts;
      
      if (primary) {
        onboarding.telemedicinePreferences.emergencyContacts.primaryContact = {
          name: primary.name || '',
          relationship: primary.relationship || '',
          phone: primary.phone || '',
          alternatePhone: primary.alternatePhone || '',
          email: primary.email || '',
          address: primary.address || ''
        };
      }
      
      if (secondary) {
        onboarding.telemedicinePreferences.emergencyContacts.secondaryContact = {
          name: secondary.name || '',
          relationship: secondary.relationship || '',
          phone: secondary.phone || '',
          alternatePhone: secondary.alternatePhone || '',
          email: secondary.email || '',
          address: secondary.address || ''
        };
      }
    }

    // Save updated onboarding
    await onboarding.save();

    return res.status(200).json({
      success: true,
      message: 'Medical information updated successfully',
      data: onboarding
    });

  } catch (error) {
    console.error('Update medical info error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update medical information',
      error: error.message
    });
  }
};

module.exports = {
  getOnboardingStatus,
  saveOnboardingData,
  getOnboardingData,
  updateMedicalInfo
};
