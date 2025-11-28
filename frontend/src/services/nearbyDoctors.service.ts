import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface DoctorLocation {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export interface ConsultationFee {
    currency: string;
    amount: number;
    mode: 'per_consult' | 'per_minute';
}

export interface NearbyDoctor {
    id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profilePicture?: string;
    };
    name: string;
    specialties: string[];
    consultationModes: ('tele' | 'in_person')[];
    languages: string[];
    profilePhoto?: string;
    shortBio: string;
    rating: number;
    reviewCount: number;
    consultationFee: ConsultationFee;
    clinicLocation: DoctorLocation;
    distance: string; // in km
    availability: any[];
}

export interface GetNearbyDoctorsParams {
    latitude: number;
    longitude: number;
    maxDistance?: number; // in meters, default 50000 (50km)
    specialty?: string;
    consultationMode?: 'tele' | 'in_person';
}

/**
 * Get nearby doctors based on user's location
 */
export const getNearbyDoctors = async (
    params: GetNearbyDoctorsParams
): Promise<{ doctors: NearbyDoctor[]; count: number }> => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('latitude', params.latitude.toString());
        queryParams.append('longitude', params.longitude.toString());

        if (params.maxDistance) {
            queryParams.append('maxDistance', params.maxDistance.toString());
        }

        if (params.specialty) {
            queryParams.append('specialty', params.specialty);
        }

        if (params.consultationMode) {
            queryParams.append('consultationMode', params.consultationMode);
        }

        const response = await axios.get(
            `${API_BASE_URL}/doctor/onboarding/nearby?${queryParams.toString()}`
        );

        return {
            doctors: response.data.data,
            count: response.data.count
        };
    } catch (error: any) {
        console.error('Error fetching nearby doctors:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch nearby doctors');
    }
};

/**
 * Get user's current location using browser geolocation API
 */
export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject(new Error(`Geolocation error: ${error.message}`));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
};

/**
 * Calculate distance between two coordinates (client-side helper)
 */
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}
