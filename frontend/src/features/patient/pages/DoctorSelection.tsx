import { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockDoctors } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const DoctorSelection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const specializations = ['all', 'Cardiologist', 'General Physician', 'Dermatologist', 'Psychiatrist', 'Pediatrician', 'Neurologist'];

  const filteredDoctors = mockDoctors
    .filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpec = selectedSpecialization === 'all' || doctor.specialization === selectedSpecialization;
      const matchesAvail = selectedAvailability === 'all' || 
                          (selectedAvailability === 'available' && doctor.availability.length > 0);
      return matchesSearch && matchesSpec && matchesAvail;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.consultationFee - b.consultationFee;
      if (sortBy === 'experience') return b.experience - a.experience;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
        <p className="text-gray-600">Browse our network of verified healthcare professionals</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Specialization Filter */}
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec === 'all' ? 'All Specializations' : spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Availability Filter */}
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available Now</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('rating')}
              >
                <Star className="w-3 h-3 mr-1" />
                Rating
              </Button>
              <Button
                variant={sortBy === 'price' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('price')}
              >
                <DollarSign className="w-3 h-3 mr-1" />
                Price
              </Button>
              <Button
                variant={sortBy === 'experience' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('experience')}
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
        <p className="text-sm text-gray-600">
          Found <span className="font-semibold text-gray-900">{filteredDoctors.length}</span> doctors
        </p>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Doctor Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={doctor.image} />
                    <AvatarFallback>{doctor.name[4]}{doctor.name.split(' ')[1]?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                      <span className="text-xs text-gray-500">({doctor.reviewCount} reviews)</span>
                    </div>
                  </div>
                  {doctor.verified && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                {/* Doctor Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Languages className="w-4 h-4" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="capitalize">{doctor.availability}</span>
                  </div>
                </div>

                {/* Consultation Types */}
                <div className="flex gap-2 mb-4">
                  {doctor.consultationTypes.includes('video') && (
                    <Badge variant="secondary" className="text-xs">
                      <Video className="w-3 h-3 mr-1" />
                      Video
                    </Badge>
                  )}
                  {doctor.consultationTypes.includes('in-person') && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      In-Person
                    </Badge>
                  )}
                </div>

                {/* Price & Book Button */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-600">Consultation Fee</p>
                    <p className="text-xl font-bold text-primary">${doctor.consultationFee}</p>
                  </div>
                  <Button onClick={() => navigate(`/patient-dashboard/book-appointment?doctorId=${doctor.id}`)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredDoctors.length === 0 && (
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
              setSelectedAvailability('all');
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
};
