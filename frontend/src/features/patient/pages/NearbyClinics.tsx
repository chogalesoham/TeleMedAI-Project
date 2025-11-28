import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  Search,
  Filter,
  Stethoscope,
  Loader2,
  AlertCircle,
  MapPinned,
  Video,
  User2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNearbyDoctors, getUserLocation, NearbyDoctor } from '@/services/nearbyDoctors.service';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createDoctorIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg style="transform: rotate(45deg); width: 16px; height: 16px; fill: white;" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const userIcon = createDoctorIcon('#3b82f6'); // Blue for user
const doctorIcon = createDoctorIcon('#10b981'); // Green for doctors

// Component to fit map bounds to all markers
function FitBounds({ markers, userLocation }: { markers: NearbyDoctor[], userLocation: { latitude: number; longitude: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0 && !userLocation) return;

    const bounds = L.latLngBounds([]);

    // Add user location to bounds
    if (userLocation) {
      bounds.extend([userLocation.latitude, userLocation.longitude]);
    }

    // Add all doctor locations to bounds
    markers.forEach(doctor => {
      bounds.extend([
        doctor.clinicLocation.coordinates.latitude,
        doctor.clinicLocation.coordinates.longitude
      ]);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, userLocation, map]);

  return null;
}

export const NearbyClinics = () => {
  const [doctors, setDoctors] = useState<NearbyDoctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<NearbyDoctor[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [selectedDoctor, setSelectedDoctor] = useState<NearbyDoctor | null>(null);

  // Get user's location on mount (optional now)
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const location = await getUserLocation();
        setUserLocation(location);
        setLocationError(null);
      } catch (error: any) {
        console.error('Location error:', error);
        // Don't show error to user, just proceed without location
        // setLocationError(error.message); 
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []);

  // Fetch ALL doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        // Pass location if available for distance calc, but it won't filter
        const { doctors: allDoctors } = await getNearbyDoctors({
          latitude: userLocation?.latitude || 0,
          longitude: userLocation?.longitude || 0,
          maxDistance: 0 // 0 or ignored by backend now
        });
        setDoctors(allDoctors);
        setFilteredDoctors(allDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [userLocation]); // Re-fetch if location becomes available to update distances

  // Filter and sort doctors
  useEffect(() => {
    let filtered = [...doctors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doctor.clinicLocation.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Specialty filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(doctor =>
        doctor.specialties.includes(selectedSpecialty)
      );
    }

    // Consultation mode filter
    if (selectedMode !== 'all') {
      filtered = filtered.filter(doctor =>
        doctor.consultationModes.includes(selectedMode as 'tele' | 'in_person')
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        return parseFloat(a.distance) - parseFloat(b.distance);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'fee') {
        return a.consultationFee.amount - b.consultationFee.amount;
      }
      return 0;
    });

    setFilteredDoctors(filtered);
  }, [doctors, searchQuery, selectedSpecialty, selectedMode, sortBy]);

  // Get unique specialties from doctors
  const specialties = Array.from(new Set(doctors.flatMap(d => d.specialties)));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Find Doctors & Clinics
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Browse all verified doctors available on our platform
        </p>
      </div>

      {/* Debug Info (Optional) */}
      {userLocation && (
        <div className="text-xs text-gray-400 px-1">
          Your Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
        </div>
      )}

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Search */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search doctors, specialties, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>

            {/* Specialty Filter */}
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="h-10 text-sm">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mode Filter */}
            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Consultation Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="tele">Telemedicine</SelectItem>
                <SelectItem value="in_person">In-Person</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="fee">Consultation Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Map */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-0">
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[20.5937, 78.9629]} // Default center of India
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <FitBounds markers={filteredDoctors} userLocation={userLocation} />

                  {/* User location marker */}
                  {userLocation && (
                    <Marker
                      position={[userLocation.latitude, userLocation.longitude]}
                      icon={userIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold">Your Location</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Doctor markers */}
                  {filteredDoctors.map((doctor) => (
                    <Marker
                      key={doctor.id}
                      position={[
                        doctor.clinicLocation.coordinates.latitude,
                        doctor.clinicLocation.coordinates.longitude
                      ]}
                      icon={doctorIcon}
                      eventHandlers={{
                        click: () => setSelectedDoctor(doctor)
                      }}
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          <h3 className="font-semibold text-sm mb-1">{doctor.name}</h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {doctor.specialties.join(', ')}
                          </p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{doctor.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-500">({doctor.reviewCount})</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {doctor.clinicLocation.city}
                          </p>
                          <Button size="sm" className="w-full text-xs h-7">
                            View Details
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Doctors List */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs sm:text-sm text-gray-600">
                {isLoadingDoctors ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading doctors...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">{filteredDoctors.length}</span>{' '}
                    {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found
                  </>
                )}
              </p>
            </div>

            {filteredDoctors.length === 0 && !isLoadingDoctors && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">No doctors found</h3>
                  <p className="text-sm text-gray-600">
                    Try adjusting your filters or search criteria
                  </p>
                </CardContent>
              </Card>
            )}

            <AnimatePresence>
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`hover:shadow-lg transition-all cursor-pointer ${selectedDoctor?.id === doctor.id ? 'ring-2 ring-primary' : ''
                      }`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Profile Photo */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {doctor.profilePhoto ? (
                            <img
                              src={doctor.profilePhoto}
                              alt={doctor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-1">
                                {doctor.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {doctor.specialties.slice(0, 2).map((specialty, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                                {doctor.specialties.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{doctor.specialties.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{doctor.rating.toFixed(1)}</span>
                              <span className="text-xs text-gray-500">({doctor.reviewCount})</span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {doctor.clinicLocation.address}, {doctor.clinicLocation.city}
                              </span>
                            </div>
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                                <Navigation className="w-4 h-4 flex-shrink-0 text-primary" />
                                <span className="font-medium text-primary">{doctor.distance} km</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                                <span className="font-medium">
                                  ₹{doctor.consultationFee.amount}
                                </span>
                                <span className="text-gray-500">/ consultation</span>
                              </div>
                            </div>
                          </div>

                          {/* Consultation Modes */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {doctor.consultationModes.includes('tele') && (
                              <Badge variant="secondary" className="text-xs">
                                <Video className="w-3 h-3 mr-1" />
                                Telemedicine
                              </Badge>
                            )}
                            {doctor.consultationModes.includes('in_person') && (
                              <Badge variant="secondary" className="text-xs">
                                <MapPinned className="w-3 h-3 mr-1" />
                                In-Person
                              </Badge>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button className="flex-1 h-9 text-sm">
                              <Phone className="w-4 h-4 mr-1.5" />
                              Book Appointment
                            </Button>
                            <Button variant="outline" className="h-9 text-sm px-3">
                              <Navigation className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 order-1 lg:order-2">
          {/* Stats Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
                  <p className="text-xs text-gray-600">Verified Doctors</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                All doctors on our platform are verified and licensed professionals
              </p>
            </CardContent>
          </Card>

          {/* Emergency Services */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm text-red-900 mb-2">
                🚨 Emergency Services
              </h3>
              <p className="text-xs text-red-800 mb-3">
                For medical emergencies, call immediately:
              </p>
              <Button variant="destructive" className="w-full h-10 text-sm font-semibold">
                <Phone className="w-4 h-4 mr-2" />
                Call 911
              </Button>
            </CardContent>
          </Card>

          {/* Quick Filters */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Quick Filters</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start h-9 text-sm"
                  onClick={() => setSelectedMode('tele')}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Telemedicine Only
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-9 text-sm"
                  onClick={() => setSortBy('rating')}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Highly Rated (4.5+)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-9 text-sm"
                  onClick={() => setSortBy('distance')}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Nearest First
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NearbyClinics;
