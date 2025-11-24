# TeleMedAI - Complete Authentication & Onboarding Flow Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Authentication Flow](#authentication-flow)
4. [Onboarding Flow](#onboarding-flow)
5. [API Routes Reference](#api-routes-reference)
6. [Data Models](#data-models)
7. [Frontend Integration](#frontend-integration)
8. [Security & Middleware](#security--middleware)
9. [Error Handling](#error-handling)
10. [Testing Guide](#testing-guide)

---

## 🎯 Overview

TeleMedAI is a comprehensive telemedicine platform that provides secure patient authentication and a detailed multi-step onboarding process. This documentation covers the complete authentication and onboarding workflow from start to finish.

### Key Features
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Patient, Doctor, and Admin roles
- **4-Step Patient Onboarding**: Comprehensive health profile collection
- **Progressive Data Collection**: Step-by-step data gathering with validation
- **RESTful API Design**: Clean, predictable API endpoints
- **Secure Password Management**: bcrypt hashing and secure storage

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Auth Pages  │  │  Onboarding  │  │  Dashboard   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│  ┌──────▼─────────────────▼──────────────────▼───────┐     │
│  │           Auth & Onboarding Services              │     │
│  │  (auth.service.ts, onboarding.service.ts)        │     │
│  └──────────────────────┬────────────────────────────┘     │
└─────────────────────────┼──────────────────────────────────┘
                          │ HTTP/REST API
┌─────────────────────────▼──────────────────────────────────┐
│                      Backend (Node.js/Express)             │
│  ┌────────────────────────────────────────────────────┐    │
│  │                    Routes Layer                    │    │
│  │  /api/auth/*          /api/patient/onboarding/*   │    │
│  └───────────┬──────────────────────┬─────────────────┘    │
│              │                      │                       │
│  ┌───────────▼──────────┐  ┌────────▼──────────────┐      │
│  │  Auth Middleware      │  │  Auth Middleware      │      │
│  │  (JWT Verification)   │  │  + Patient Only      │      │
│  └───────────┬───────────┘  └────────┬──────────────┘      │
│              │                       │                      │
│  ┌───────────▼──────────┐  ┌────────▼──────────────┐      │
│  │  Auth Controllers     │  │  Onboarding          │      │
│  │  - signup            │  │  Controllers         │      │
│  │  - login             │  │  - save data         │      │
│  │  - profile           │  │  - get status        │      │
│  └───────────┬───────────┘  └────────┬──────────────┘      │
│              │                       │                      │
│  ┌───────────▼───────────────────────▼──────────────┐      │
│  │                  Models Layer                     │      │
│  │     User Model          PatientOnboarding        │      │
│  └───────────┬───────────────────────┬───────────────┘      │
└──────────────┼───────────────────────┼────────────────────┘
               │                       │
┌──────────────▼───────────────────────▼────────────────────┐
│                    MongoDB Database                        │
│  ┌─────────────┐              ┌──────────────────┐        │
│  │   Users     │              │  PatientOnboarding │        │
│  │  Collection │              │    Collection     │        │
│  └─────────────┘              └──────────────────┘        │
└────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### 1. Patient Signup Flow

**Endpoint**: `POST /api/auth/patient/signup`

**Request Flow**:
```
Client → Backend → Validation → Hash Password → Create User → 
Generate JWT → Return Token & User Data
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "location": {
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Patient account created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "gender": "Male",
      "location": {
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "zipCode": "10001"
      },
      "role": "patient",
      "profilePicture": "",
      "onboardingCompleted": false,
      "isActive": true,
      "isEmailVerified": false,
      "createdAt": "2024-01-20T10:30:00.000Z"
    }
  }
}
```

**Process Steps**:
1. **Validation**: Check all required fields are present
2. **Duplicate Check**: Verify email doesn't already exist
3. **Password Hashing**: Use bcrypt with salt (rounds: 10)
4. **User Creation**: Create new user document with role='patient'
5. **Token Generation**: Generate JWT with 7-day expiration
6. **Response**: Return token and sanitized user data

---

### 2. Patient Login Flow

**Endpoint**: `POST /api/auth/patient/login`

**Request Flow**:
```
Client → Backend → Find User → Verify Password → Check Active Status → 
Update Last Login → Check Onboarding → Generate JWT → Return Token
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient",
      "onboardingCompleted": false
    },
    "onboardingCompleted": false,
    "redirectTo": "/patient-onboarding"
  }
}
```

**Process Steps**:
1. **Validation**: Check email and password provided
2. **User Lookup**: Find user by email with role='patient'
3. **Active Check**: Verify user account is active
4. **Password Verification**: Compare hashed password using bcrypt
5. **Update Login Time**: Set lastLogin timestamp
6. **Onboarding Check**: Query PatientOnboarding collection
7. **Token Generation**: Create new JWT token
8. **Redirect Logic**: Determine redirect path based on onboarding status

**Redirect Logic**:
- `onboardingCompleted: true` → `/patient-dashboard`
- `onboardingCompleted: false` → `/patient-onboarding`

---

### 3. Get Current User

**Endpoint**: `GET /api/auth/me`

**Headers Required**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "patient",
      "onboardingCompleted": true
    },
    "onboardingCompleted": true
  }
}
```

---

### 4. Update Profile

**Endpoint**: `PUT /api/auth/profile`

**Headers Required**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "name": "John David Doe",
  "phone": "+1234567891",
  "location": {
    "city": "Los Angeles",
    "state": "CA"
  },
  "profilePicture": "https://example.com/avatar.jpg"
}
```

---

### 5. Change Password

**Endpoint**: `POST /api/auth/change-password`

**Headers Required**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newsecurepassword456"
}
```

---

### 6. Logout

**Endpoint**: `POST /api/auth/logout`

**Headers Required**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Note**: Since JWT is stateless, logout is primarily handled client-side by removing the token from storage. The backend endpoint is provided for consistency and potential future token blacklisting.

---

## 🏥 Onboarding Flow

The patient onboarding process consists of **4 comprehensive steps** that collect detailed health and personal information.

### Onboarding Progress Tracking

```
Step 1 → Step 2 → Step 3 → Step 4 → Completed
   ✓        ✓        ✓        ✓         ✓
```

**Progress Structure**:
```javascript
{
  step1Completed: boolean,
  step2Completed: boolean,
  step3Completed: boolean,
  step4Completed: boolean,
  isCompleted: boolean,
  completedAt: Date,
  currentStep: number (1-4)
}
```

---

### Step 1: Basic Health Profile

**Purpose**: Collect fundamental physical health metrics

**Data Collected**:
- Height (with unit: cm/ft)
- Weight (with unit: kg/lbs)
- BMI (auto-calculated)
- Blood Group
- Gender
- Date of Birth

**Example Data**:
```json
{
  "step": 1,
  "data": {
    "height": {
      "value": 175,
      "unit": "cm"
    },
    "weight": {
      "value": 70,
      "unit": "kg"
    },
    "bloodGroup": "A+",
    "gender": "Male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z"
  }
}
```

**BMI Calculation**:
- Formula: `BMI = weight(kg) / (height(m))²`
- Automatically calculated by backend
- Stored as decimal (e.g., 22.9)

**Blood Group Options**:
- A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown

---

### Step 2: Medical History

**Purpose**: Capture historical medical conditions and treatments

**Data Collected**:

#### Chronic Diseases
```json
{
  "chronicDiseases": [
    {
      "name": "Diabetes Type 2",
      "diagnosedYear": 2015,
      "notes": "Managed with medication and diet"
    }
  ]
}
```

#### Previous Surgeries
```json
{
  "previousSurgeries": [
    {
      "name": "Appendectomy",
      "year": 2010,
      "notes": "No complications"
    }
  ]
}
```

#### Hospitalizations
```json
{
  "hospitalizations": [
    {
      "reason": "Pneumonia",
      "year": 2018,
      "duration": "5 days",
      "hospital": "City General Hospital"
    }
  ]
}
```

#### Family Medical History
```json
{
  "familyMedicalHistory": [
    {
      "relation": "Father",
      "condition": "Hypertension",
      "notes": "Diagnosed at age 55"
    }
  ]
}
```

---

### Step 3: Current Health Status & Lifestyle

**Purpose**: Document current medications, allergies, and lifestyle habits

**Data Collected**:

#### Current Medications
```json
{
  "currentMedications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "startDate": "2020-03-15T00:00:00.000Z",
      "prescribedBy": "Dr. Smith"
    }
  ]
}
```

#### Allergies
```json
{
  "allergies": [
    {
      "allergen": "Penicillin",
      "reaction": "Skin rash",
      "severity": "Moderate"
    }
  ]
}
```

**Severity Levels**: Mild, Moderate, Severe, Life-threatening

#### Lifestyle Factors

**Smoking Status**:
```json
{
  "smokingStatus": "Former",
  "smokingDetails": {
    "cigarettesPerDay": 10,
    "yearsSmoked": 5
  }
}
```
Options: Never, Former, Current

**Alcohol Consumption**:
```json
{
  "alcoholConsumption": "Occasionally",
  "alcoholDetails": {
    "drinksPerWeek": 2
  }
}
```
Options: Never, Occasionally, Moderate, Heavy

**Exercise Frequency**:
```json
{
  "exerciseFrequency": "3-4 times/week",
  "exerciseType": ["Running", "Yoga"]
}
```
Options: None, 1-2 times/week, 3-4 times/week, 5+ times/week, Daily

**Diet Type**:
```json
{
  "dietType": "Vegetarian"
}
```
Options: Regular, Vegetarian, Vegan, Pescatarian, Keto, Other

**Sleep Pattern**:
```json
{
  "sleepHours": {
    "average": 7,
    "quality": "Good"
  }
}
```
Quality Options: Poor, Fair, Good, Excellent

---

### Step 4: Emergency Contacts

**Purpose**: Establish emergency contact information for critical situations

**Data Collected**:

#### Primary Contact (Required)
```json
{
  "primaryContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1234567890",
    "alternatePhone": "+1234567891",
    "email": "jane@example.com",
    "address": "123 Main St, New York, NY 10001"
  }
}
```

#### Secondary Contact (Optional)
```json
{
  "secondaryContact": {
    "name": "Robert Doe",
    "relationship": "Brother",
    "phone": "+1234567892",
    "alternatePhone": "+1234567893",
    "email": "robert@example.com",
    "address": "456 Oak Ave, Brooklyn, NY 11201"
  }
}
```

**Common Relationships**:
- Spouse, Parent, Child, Sibling, Friend, Caregiver, Other

---

## 📡 API Routes Reference

### Authentication Routes (Public & Protected)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/patient/signup` | Public | Register new patient account |
| POST | `/api/auth/patient/login` | Public | Login patient and get JWT token |
| GET | `/api/auth/me` | Protected | Get current user profile |
| POST | `/api/auth/logout` | Protected | Logout user (clear token client-side) |
| POST | `/api/auth/change-password` | Protected | Change user password |
| PUT | `/api/auth/profile` | Protected | Update user profile information |

### Onboarding Routes (All Protected - Patient Only)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/patient/onboarding/status` | Protected (Patient) | Get onboarding progress status |
| GET | `/api/patient/onboarding/data` | Protected (Patient) | Get complete onboarding data |
| POST | `/api/patient/onboarding/save` | Protected (Patient) | Save/update onboarding step data |
| PUT | `/api/patient/onboarding/medical-info` | Protected (Patient) | Update medical information |

---

## 🗂️ Data Models

### User Model

**Collection**: `users`

```javascript
{
  // Basic Information
  name: String (required),
  email: String (required, unique, validated),
  password: String (required, hashed, min 6 chars),
  phone: String (required),
  dateOfBirth: Date (required),
  gender: Enum ['Male', 'Female', 'Other', 'Prefer not to say'],
  location: {
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // User Role
  role: Enum ['patient', 'doctor', 'admin'], default: 'patient',
  
  // Account Status
  isActive: Boolean, default: true,
  isEmailVerified: Boolean, default: false,
  
  // Onboarding
  onboardingCompleted: Boolean, default: false,
  
  // Profile
  profilePicture: String,
  
  // Metadata
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Model Methods**:
- `comparePassword(candidatePassword)`: Verify password using bcrypt
- `generateAuthToken()`: Generate JWT token with user data
- `getPublicProfile()`: Return sanitized user object (no password)

**Middleware Hooks**:
- **Pre-save**: Hash password using bcrypt with 10 salt rounds

---

### PatientOnboarding Model

**Collection**: `patientonboardings`

```javascript
{
  userId: ObjectId (ref: 'User', required, unique),
  
  // Step 1: Basic Health Profile
  basicHealthProfile: {
    height: {
      value: Number,
      unit: Enum ['cm', 'ft']
    },
    weight: {
      value: Number,
      unit: Enum ['kg', 'lbs']
    },
    bmi: Number (auto-calculated),
    bloodGroup: Enum ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    gender: Enum ['Male', 'Female', 'Other', 'Prefer not to say'],
    dateOfBirth: Date
  },
  
  // Step 2: Medical History
  medicalHistory: {
    chronicDiseases: [{
      name: String,
      diagnosedYear: Number,
      notes: String
    }],
    previousSurgeries: [{
      name: String,
      year: Number,
      notes: String
    }],
    hospitalizations: [{
      reason: String,
      year: Number,
      duration: String,
      hospital: String
    }],
    familyMedicalHistory: [{
      relation: String,
      condition: String,
      notes: String
    }]
  },
  
  // Step 3: Current Health Status
  currentHealthStatus: {
    currentMedications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      prescribedBy: String
    }],
    allergies: [{
      allergen: String,
      reaction: String,
      severity: Enum ['Mild', 'Moderate', 'Severe', 'Life-threatening']
    }],
    smokingStatus: Enum ['Never', 'Former', 'Current'],
    smokingDetails: {
      cigarettesPerDay: Number,
      yearsSmoked: Number
    },
    alcoholConsumption: Enum ['Never', 'Occasionally', 'Moderate', 'Heavy'],
    alcoholDetails: {
      drinksPerWeek: Number
    },
    exerciseFrequency: Enum ['None', '1-2 times/week', '3-4 times/week', '5+ times/week', 'Daily'],
    exerciseType: [String],
    dietType: Enum ['Regular', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Other'],
    sleepHours: {
      average: Number,
      quality: Enum ['Poor', 'Fair', 'Good', 'Excellent']
    },
    ongoingTreatments: [{
      condition: String,
      treatmentType: String,
      provider: String,
      startDate: Date
    }]
  },
  
  // Step 4: Emergency Contacts
  telemedicinePreferences: {
    emergencyContacts: {
      primaryContact: {
        name: String,
        relationship: String,
        phone: String,
        alternatePhone: String,
        email: String,
        address: String
      },
      secondaryContact: {
        name: String,
        relationship: String,
        phone: String,
        alternatePhone: String,
        email: String,
        address: String
      }
    }
  },
  
  // Progress Tracking
  onboardingProgress: {
    step1Completed: Boolean, default: false,
    step2Completed: Boolean, default: false,
    step3Completed: Boolean, default: false,
    step4Completed: Boolean, default: false,
    isCompleted: Boolean, default: false,
    completedAt: Date,
    currentStep: Number, default: 1
  },
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

**Model Methods**:
- `checkOnboardingComplete()`: Check if all 4 steps completed and update status

**Middleware Hooks**:
- **Pre-save**: Calculate BMI automatically from height and weight

---

## 💻 Frontend Integration

### Auth Service (auth.service.ts)

**Location**: `frontend/src/services/auth.service.ts`

**Functions**:

```typescript
// Patient Signup
patientSignup(data: SignupData): Promise<AuthResponse>

// Patient Login
patientLogin(data: LoginData): Promise<AuthResponse>

// Get Current User
getCurrentUser(): Promise<any>

// Logout
logout(): Promise<any>

// Change Password
changePassword(data: ChangePasswordData): Promise<any>

// Update Profile
updateProfile(data: ProfileData): Promise<any>
```

**Token Management**:
```typescript
// Store token after successful authentication
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Get auth header for API calls
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Remove token on logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

### Onboarding Service (onboarding.service.ts)

**Location**: `frontend/src/services/onboarding.service.ts`

**Functions**:

```typescript
// Get onboarding status
getOnboardingStatus(): Promise<OnboardingStatusResponse>

// Save step data
saveOnboardingData(step: number, data: any): Promise<SaveOnboardingResponse>

// Get complete onboarding data
getOnboardingData(): Promise<any>

// Update medical information
updateMedicalInfo(data: any): Promise<any>
```

**Usage Example**:
```typescript
// Step 1: Save basic health profile
const response = await saveOnboardingData(1, {
  height: { value: 175, unit: 'cm' },
  weight: { value: 70, unit: 'kg' },
  bloodGroup: 'A+',
  gender: 'Male',
  dateOfBirth: '1990-01-15'
});

// Check if step completed
if (response.success) {
  console.log('Current step:', response.data.currentStep); // 2
  console.log('Progress:', response.data.progress);
}
```

---

## 🔒 Security & Middleware

### JWT Authentication Middleware

**File**: `backend/middleware/auth.js`

**Function**: `authMiddleware`

**Process**:
1. Extract token from Authorization header (`Bearer <token>`)
2. Verify token using JWT_SECRET
3. Decode payload and attach user info to `req.user`
4. Handle token expiration and invalid tokens

**Request Object Enhancement**:
```javascript
req.user = {
  userId: decoded.userId,
  email: decoded.email,
  role: decoded.role
}
```

**Error Responses**:
- **401**: No token, invalid token, or expired token
- **500**: Authentication processing error

---

### Patient-Only Middleware

**Function**: `patientOnly`

**Purpose**: Restrict routes to users with patient role

**Usage**:
```javascript
router.use(authMiddleware);
router.use(patientOnly); // Apply to all onboarding routes
```

**Process**:
1. Check `req.user.role === 'patient'`
2. Allow access if patient, return 403 if not

---

### Password Security

**Hashing Algorithm**: bcrypt with 10 salt rounds

**Implementation**:
```javascript
// Pre-save hook in User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

**Requirements**:
- Minimum 6 characters
- Hashed before storage
- Never returned in API responses (select: false)

---

### JWT Token Structure

**Payload**:
```javascript
{
  userId: user._id,
  email: user.email,
  role: user.role,
  name: user.name,
  iat: 1234567890,  // Issued at
  exp: 1234567890   // Expires at (7 days)
}
```

**Configuration**:
- **Secret**: `process.env.JWT_SECRET`
- **Expiration**: `7d` (7 days)
- **Algorithm**: HS256

---

## ⚠️ Error Handling

### Common Error Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 400 | Bad Request | Missing fields, invalid data format |
| 401 | Unauthorized | Invalid credentials, expired token |
| 403 | Forbidden | Insufficient permissions (not patient) |
| 404 | Not Found | User or onboarding data not found |
| 409 | Conflict | Duplicate email (already exists) |
| 500 | Server Error | Database errors, unexpected failures |

---

### Error Response Format

**Standard Error Response**:
```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details (dev mode)",
  "errors": ["Array of validation errors"]
}
```

---

### Authentication Errors

**Token Expired**:
```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

**Invalid Token**:
```json
{
  "success": false,
  "message": "Invalid token. Please login again."
}
```

**No Token Provided**:
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

### Validation Errors

**Missing Required Fields**:
```json
{
  "success": false,
  "message": "Please provide all required fields: name, email, password, phone, dateOfBirth, gender"
}
```

**Duplicate Email**:
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**Password Too Short**:
```json
{
  "success": false,
  "message": "Password must be at least 6 characters"
}
```

---

## 🧪 Testing Guide

### Manual API Testing with Postman/cURL

#### 1. Patient Signup
```bash
curl -X POST http://localhost:5000/api/auth/patient/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "gender": "Male",
    "location": {
      "city": "New York",
      "state": "NY"
    }
  }'
```

#### 2. Patient Login
```bash
curl -X POST http://localhost:5000/api/auth/patient/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

#### 3. Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Get Onboarding Status
```bash
curl -X GET http://localhost:5000/api/patient/onboarding/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. Save Onboarding Step 1
```bash
curl -X POST http://localhost:5000/api/patient/onboarding/save \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "step": 1,
    "data": {
      "height": {"value": 175, "unit": "cm"},
      "weight": {"value": 70, "unit": "kg"},
      "bloodGroup": "A+",
      "gender": "Male"
    }
  }'
```

#### 6. Save Onboarding Step 2
```bash
curl -X POST http://localhost:5000/api/patient/onboarding/save \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "step": 2,
    "data": {
      "chronicDiseases": [
        {
          "name": "Diabetes",
          "diagnosedYear": 2015,
          "notes": "Type 2"
        }
      ],
      "previousSurgeries": []
    }
  }'
```

#### 7. Save Onboarding Step 3
```bash
curl -X POST http://localhost:5000/api/patient/onboarding/save \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "step": 3,
    "data": {
      "currentMedications": [
        {
          "name": "Metformin",
          "dosage": "500mg",
          "frequency": "Twice daily"
        }
      ],
      "allergies": [],
      "smokingStatus": "Never",
      "alcoholConsumption": "Occasionally",
      "exerciseFrequency": "3-4 times/week",
      "dietType": "Regular",
      "sleepHours": 7
    }
  }'
```

#### 8. Save Onboarding Step 4
```bash
curl -X POST http://localhost:5000/api/patient/onboarding/save \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "step": 4,
    "data": {
      "primaryContact": {
        "name": "Jane Doe",
        "relationship": "Spouse",
        "phone": "+1234567890",
        "email": "jane@example.com"
      }
    }
  }'
```

---

### Testing Checklist

#### Authentication Tests
- [ ] Signup with valid data
- [ ] Signup with duplicate email (should fail)
- [ ] Signup with missing fields (should fail)
- [ ] Login with correct credentials
- [ ] Login with incorrect password (should fail)
- [ ] Login with non-existent email (should fail)
- [ ] Access protected route with valid token
- [ ] Access protected route without token (should fail)
- [ ] Access protected route with expired token (should fail)
- [ ] Change password with correct current password
- [ ] Change password with incorrect current password (should fail)
- [ ] Update profile with valid data
- [ ] Logout successfully

#### Onboarding Tests
- [ ] Get onboarding status for new user (should show step 1)
- [ ] Save Step 1 data
- [ ] Verify Step 1 marked as completed
- [ ] Save Step 2 data
- [ ] Save Step 3 data
- [ ] Save Step 4 data
- [ ] Verify onboarding isCompleted after all steps
- [ ] Get complete onboarding data
- [ ] Update medical information
- [ ] Verify BMI auto-calculation
- [ ] Test onboarding without authentication (should fail)
- [ ] Test onboarding with non-patient role (should fail)

---

## 📊 Complete User Journey

### New Patient Registration to Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ 1. User visits signup page                             │
│    ↓                                                    │
│ 2. Fills signup form (name, email, password, etc.)     │
│    ↓                                                    │
│ 3. POST /api/auth/patient/signup                       │
│    ↓                                                    │
│ 4. Backend validates and creates user                  │
│    ↓                                                    │
│ 5. JWT token generated and returned                    │
│    ↓                                                    │
│ 6. Frontend stores token in localStorage               │
│    ↓                                                    │
│ 7. Check onboardingCompleted: false                    │
│    ↓                                                    │
│ 8. Redirect to /patient-onboarding                     │
│    ↓                                                    │
│ 9. GET /api/patient/onboarding/status                  │
│    ↓                                                    │
│10. Show Step 1: Basic Health Profile                   │
│    ↓                                                    │
│11. User fills Step 1 form                              │
│    ↓                                                    │
│12. POST /api/patient/onboarding/save (step: 1)         │
│    ↓                                                    │
│13. Progress to Step 2: Medical History                 │
│    ↓                                                    │
│14. User fills Step 2 form                              │
│    ↓                                                    │
│15. POST /api/patient/onboarding/save (step: 2)         │
│    ↓                                                    │
│16. Progress to Step 3: Current Health                  │
│    ↓                                                    │
│17. User fills Step 3 form                              │
│    ↓                                                    │
│18. POST /api/patient/onboarding/save (step: 3)         │
│    ↓                                                    │
│19. Progress to Step 4: Emergency Contacts              │
│    ↓                                                    │
│20. User fills Step 4 form                              │
│    ↓                                                    │
│21. POST /api/patient/onboarding/save (step: 4)         │
│    ↓                                                    │
│22. Onboarding marked as completed                      │
│    ↓                                                    │
│23. Update User.onboardingCompleted = true              │
│    ↓                                                    │
│24. Redirect to /patient-dashboard                      │
│    ↓                                                    │
│25. Patient can now access full features                │
└─────────────────────────────────────────────────────────┘
```

---

### Returning Patient Login

```
┌─────────────────────────────────────────────────────────┐
│ 1. User visits login page                              │
│    ↓                                                    │
│ 2. Enters email and password                           │
│    ↓                                                    │
│ 3. POST /api/auth/patient/login                        │
│    ↓                                                    │
│ 4. Backend verifies credentials                        │
│    ↓                                                    │
│ 5. Check onboarding status                             │
│    ↓                                                    │
│ 6. Generate JWT token                                  │
│    ↓                                                    │
│ 7. Return token + redirectTo path                      │
│    ↓                                                    │
│ 8. Frontend stores token                               │
│    ↓                                                    │
│ 9. If onboardingCompleted = true                       │
│    → Redirect to /patient-dashboard                    │
│    Else                                                 │
│    → Redirect to /patient-onboarding (resume)          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Best Practices & Recommendations

### Security
1. **Always use HTTPS** in production
2. **Implement rate limiting** on authentication endpoints
3. **Use strong JWT secrets** (minimum 32 characters)
4. **Rotate JWT tokens** periodically
5. **Implement token blacklisting** for logout
6. **Add email verification** for new accounts
7. **Implement two-factor authentication** for enhanced security

### Data Validation
1. **Validate all input** on both frontend and backend
2. **Sanitize user input** to prevent injection attacks
3. **Use schema validation** (e.g., Joi, Yup)
4. **Implement proper error messages** without exposing system details
5. **Validate file uploads** if profile pictures are supported

### User Experience
1. **Show progress indicator** during onboarding
2. **Allow saving draft data** (partial completion)
3. **Provide helpful tooltips** for medical terms
4. **Enable easy navigation** between onboarding steps
5. **Display confirmation** before final submission
6. **Send email notifications** on account creation and onboarding completion

### Performance
1. **Index database fields** (email, userId)
2. **Implement caching** for frequently accessed data
3. **Paginate large data sets**
4. **Optimize BMI calculation** (done on save, not on every read)
5. **Use connection pooling** for database connections

### Monitoring & Logging
1. **Log all authentication attempts**
2. **Track onboarding completion rates**
3. **Monitor API response times**
4. **Set up error tracking** (e.g., Sentry)
5. **Implement health check endpoints**

---

## 📈 Analytics & Metrics

### Key Metrics to Track

1. **User Registration Rate**: New signups per day/week/month
2. **Onboarding Completion Rate**: % of users completing all 4 steps
3. **Step Drop-off Rates**: Which step users abandon most
4. **Average Time to Complete**: Time spent on onboarding
5. **Login Success Rate**: % of successful login attempts
6. **Password Reset Frequency**: How often users forget passwords
7. **API Response Times**: Average latency for each endpoint
8. **Error Rates**: Frequency of 4xx and 5xx errors

---

## 🔄 Future Enhancements

### Planned Features
1. **Email Verification**: Send verification link after signup
2. **Password Reset**: Forgot password functionality
3. **Social Login**: Google, Facebook, Apple authentication
4. **Multi-factor Authentication**: SMS or authenticator app
5. **Profile Picture Upload**: File upload with image processing
6. **Data Export**: Allow users to download their health data
7. **Data Privacy Controls**: GDPR compliance features
8. **Onboarding Resume**: Save progress and continue later
9. **Doctor Onboarding**: Separate flow for doctor registration
10. **Admin Dashboard**: Manage users and view analytics

### Technical Improvements
1. **GraphQL API**: Alternative to REST for flexible queries
2. **WebSocket Support**: Real-time notifications
3. **Microservices Architecture**: Separate auth and onboarding services
4. **Redis Caching**: Improve performance
5. **Docker Containerization**: Easier deployment
6. **CI/CD Pipeline**: Automated testing and deployment
7. **API Versioning**: Support multiple API versions
8. **OpenAPI/Swagger Docs**: Interactive API documentation

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: "Token has expired"
- **Solution**: Login again to get a new token

**Issue**: "Access denied. Patient role required"
- **Solution**: Ensure user is registered as a patient, not doctor/admin

**Issue**: "Onboarding data not found"
- **Solution**: User must complete at least Step 1 before data exists

**Issue**: "BMI not calculating"
- **Solution**: Ensure both height and weight are provided with valid units

**Issue**: "Cannot save onboarding step"
- **Solution**: Check that user is authenticated and token is valid

---

## 📝 Environment Variables

### Required Configuration

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/telemedai
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/telemedai

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🏁 Conclusion

This documentation provides a comprehensive overview of the TeleMedAI authentication and onboarding system. The implementation follows industry best practices for security, scalability, and user experience.

**Key Takeaways**:
- ✅ Secure JWT-based authentication
- ✅ Role-based access control
- ✅ Comprehensive 4-step patient onboarding
- ✅ RESTful API design
- ✅ Complete data validation
- ✅ Error handling and logging
- ✅ Frontend-backend integration

For questions or support, please refer to the project repository or contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: November 24, 2025  
**Maintained By**: TeleMedAI Development Team
