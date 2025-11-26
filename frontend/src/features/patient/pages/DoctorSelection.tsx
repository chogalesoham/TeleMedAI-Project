import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  DollarSign,
  Clock,
  Video,
  Calendar,
  Award,
  Languages,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import PatientService from '@/services/patient.service';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  name: string;
  profilePicture: string;
  specialties: string[];
  languages: string[];
  consultationModes: string[];
  consultationFee: {
    currency: string;
    amount: number;
    mode: string;
  };
  shortBio: string;
  rating: number;
  reviewCount: number;
  experience: number;
  availability: any[];
}

export const DoctorSelection = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience'>('rating');

  const specializations = ['all', 'Cardiology', 'General Medicine', 'Dermatology', 'Psychiatry', 'Pediatrics', 'Neurology'];

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialization, sortBy]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await PatientService.getApprovedDoctors({
        specialization: selectedSpecialization !== 'all' ? selectedSpecialization : undefined,
        search: searchQuery,
        sortBy
      });

      if (response.success && response.data) {
        setDoctors(response.data.doctors || []);
      } else {
        toast.error(response.error || 'Failed to load doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchDoctors();
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return doctor.name.toLowerCase().includes(searchLower) ||
      doctor.specialties.some(s => s.toLowerCase().includes(searchLower));
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">Find Your Doctor</h1>
        <p className="text-sm sm:text-base text-gray-600">Browse our network of verified healthcare professionals</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <Input
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9 sm:pl-10 text-sm sm:text-base h-9 sm:h-10"
              />
            </div>

            {/* Specialization Filter */}
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="text-sm sm:text-base h-9 sm:h-10">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec} className="text-sm">
                    {spec === 'all' ? 'All Specializations' : spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button onClick={handleSearch} className="h-9 sm:h-10">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <span className="text-xs sm:text-sm text-gray-600">Sort by:</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('rating')}
                className="text-xs h-8"
              >
                <Star className="w-3 h-3 mr-1" />
                Rating
              </Button>
              <Button
                variant={sortBy === 'price' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('price')}
                className="text-xs h-8"
              >
                <DollarSign className="w-3 h-3 mr-1" />
                Price
              </Button>
              <Button
                variant={sortBy === 'experience' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('experience')}
                className="text-xs h-8"
              >
                <Award className="w-3 h-3 mr-1" />
                Experience
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-600">
          Found <span className="font-semibold text-gray-900">{filteredDoctors.length}</span> doctors
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Doctor Cards Grid */}
      {!isLoading && filteredDoctors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/patient-dashboard/doctor/${doctor.id}`)}>
                <CardContent className="p-4 sm:p-6">
                  {/* Doctor Header */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                      <AvatarImage src={doctor.profilePicture} />
                      <AvatarFallback className="text-sm sm:text-base">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialties[0] || 'General Practice'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-xs text-gray-500">({doctor.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Languages className="w-4 h-4" />
                      <span>{doctor.languages.join(', ')}</span>
                    </div>
                    {doctor.availability.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Available</span>
                      </div>
                    )}
                  </div>

                  {/* Consultation Types */}
                  <div className="flex gap-2 mb-4">
                    {doctor.consultationModes.includes('tele') && (
                      <Badge variant="secondary" className="text-xs">
                        <Video className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    )}
                    {doctor.consultationModes.includes('in_person') && (
                      <Badge variant="secondary" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        In-Person
                      </Badge>
                    )}
                  </div>

                  {/* Price & View Profile Button */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Consultation Fee</p>
                      <p className="text-xl font-bold text-primary">
                        {doctor.consultationFee.currency} {doctor.consultationFee.amount}
                      </p>
                    </div>
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/patient-dashboard/doctor/${doctor.id}`);
                    }}>
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredDoctors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialization('all');
              fetchDoctors();
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
};
