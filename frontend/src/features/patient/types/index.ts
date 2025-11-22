// Shared types for patient dashboard
export interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorImage: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image: string;
  rating: number;
  reviews: number;
  reviewCount: number;
  experience: number;
  availability: string[];
  consultationFee: number;
  languages: string[];
  verified: boolean;
  location: string;
  consultationTypes: ('video' | 'in-person')[];
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  description: string;
}

export interface Diagnosis {
  id: string;
  condition: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  relatedSymptoms: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timings: string[];
  instructions: string;
  taken: boolean[];
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: 'consultation' | 'lab-report' | 'prescription' | 'imaging';
  title: string;
  doctor?: string;
  doctorName?: string;
  description: string;
  summary?: string;
  fileUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Stats {
  totalConsultations: number;
  upcomingAppointments: number;
  medicationsActive: number;
  adherenceRate: number;
}

export interface DietPlan {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
  image: string;
}

export interface Clinic {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'lab';
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  phone: string;
  hours?: string;
  services: string[];
  latitude: number;
  longitude: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  bloodType?: string;
  address?: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  avatar?: string;
}
