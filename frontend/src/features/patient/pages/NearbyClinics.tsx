import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star,
  Navigation,
  Search,
  Filter,
  Building2,
  Stethoscope,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockClinics } from '../data/mockData';

export const NearbyClinics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  const clinicTypes = [
    { value: 'all', label: 'All Facilities' },
    { value: 'hospital', label: 'Hospitals' },
    { value: 'clinic', label: 'Clinics' },
    { value: 'lab', label: 'Diagnostic Labs' },
    { value: 'pharmacy', label: 'Pharmacies' },
  ];

  const filteredClinics = mockClinics
    .filter(clinic => {
      const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          clinic.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || clinic.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return Building2;
      case 'clinic':
        return Stethoscope;
      case 'lab':
        return Activity;
      default:
        return MapPin;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital':
        return 'bg-red-100 text-red-700';
      case 'clinic':
        return 'bg-blue-100 text-blue-700';
      case 'lab':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Nearby Medical Facilities</h1>
        <p className="text-sm sm:text-base text-gray-600">Find hospitals, clinics, and diagnostic centers near you</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <Input
                placeholder="Search facilities, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-9 sm:h-10 text-sm">
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <SelectValue placeholder="Facility type" />
              </SelectTrigger>
              <SelectContent>
                {clinicTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-sm">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance" className="text-sm">Distance</SelectItem>
                <SelectItem value="rating" className="text-sm">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-0">
              <div className="relative h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden">
                {/* Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <MapPin className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-blue-600 mx-auto mb-2 sm:mb-3 md:mb-4" />
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Interactive Map</h3>
                    <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm px-2">
                      Map integration would show facility locations here
                    </p>
                  </div>
                </div>

                {/* Map Pins (Mock) */}
                {filteredClinics.slice(0, 4).map((clinic, index) => (
                  <motion.div
                    key={clinic.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring' }}
                    className="absolute"
                    style={{
                      left: `${20 + index * 20}%`,
                      top: `${30 + index * 15}%`,
                    }}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg shadow-md whitespace-nowrap text-[10px] sm:text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                        {clinic.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Facilities List */}
          <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredClinics.length}</span> {filteredClinics.length === 1 ? 'facility' : 'facilities'} found
              </p>
            </div>

            {filteredClinics.map((clinic, index) => {
              const TypeIcon = getTypeIcon(clinic.type);
              return (
                <motion.div
                  key={clinic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
                      <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                        {/* Icon */}
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg ${getTypeColor(clinic.type)} flex items-center justify-center flex-shrink-0`}>
                          <TypeIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header with name and rating */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-1">{clinic.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="capitalize text-[9px] sm:text-[10px] md:text-xs py-0 px-1.5 sm:px-2">
                                  {clinic.type}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold text-xs sm:text-sm">{clinic.rating}</span>
                                  <span className="text-[10px] sm:text-xs text-gray-500">({clinic.reviewCount})</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                            <div className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm text-gray-600">
                              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{clinic.address}</span>
                            </div>
                            <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm">
                                <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-primary" />
                                <span className="font-medium text-primary">{clinic.distance}</span>
                              </div>
                              {clinic.phone && (
                                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm text-gray-600">
                                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                  <span>{clinic.phone}</span>
                                </div>
                              )}
                              {clinic.hours && (
                                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm text-gray-600">
                                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                  <span>{clinic.hours}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Services */}
                          {clinic.services && clinic.services.length > 0 && (
                            <div className="mb-2.5 sm:mb-3">
                              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {clinic.services.slice(0, 3).map((service, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-[9px] sm:text-[10px] md:text-xs py-0.5 px-1.5 sm:px-2">
                                    {service}
                                  </Badge>
                                ))}
                                {clinic.services.length > 3 && (
                                  <Badge variant="secondary" className="text-[9px] sm:text-[10px] md:text-xs py-0.5 px-1.5 sm:px-2">
                                    +{clinic.services.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button className="flex-1 h-8 sm:h-9 md:h-10 text-[11px] sm:text-xs md:text-sm px-2 sm:px-3">
                              <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5" />
                              <span>Directions</span>
                            </Button>
                            <Button variant="outline" className="flex-1 h-8 sm:h-9 md:h-10 text-[11px] sm:text-xs md:text-sm px-2 sm:px-3">
                              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5" />
                              <span>Call</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6 order-1 lg:order-2">
          {/* Emergency Services - Show first on mobile */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-red-900 mb-1.5 sm:mb-2">🚨 Emergency Services</h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-red-800 mb-2.5 sm:mb-3 lg:mb-4 leading-relaxed">
                For medical emergencies, call immediately:
              </p>
              <Button variant="destructive" className="w-full h-9 sm:h-10 lg:h-11 text-xs sm:text-sm md:text-base font-semibold" size="lg">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-2" />
                Call 911
              </Button>
            </CardContent>
          </Card>

          {/* Quick Filters */}
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3 lg:mb-4">Quick Filters</h3>
              <div className="space-y-1.5 sm:space-y-2">
                <Button variant="outline" className="w-full justify-start h-8 sm:h-9 lg:h-10 text-[11px] sm:text-xs md:text-sm" size="sm">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-2" />
                  Open Now
                </Button>
                <Button variant="outline" className="w-full justify-start h-8 sm:h-9 lg:h-10 text-[11px] sm:text-xs md:text-sm" size="sm">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-2" />
                  Highly Rated (4.5+)
                </Button>
                <Button variant="outline" className="w-full justify-start h-8 sm:h-9 lg:h-10 text-[11px] sm:text-xs md:text-sm" size="sm">
                  <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-2" />
                  Within 5km
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Popular Services */}
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Popular Services</h3>
              <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
                {[
                  'Blood Test',
                  'X-Ray',
                  'Vaccination',
                  'Health Checkup',
                  'ECG'
                ].map((service) => (
                  <div key={service} className="flex items-center justify-between p-1.5 sm:p-2 bg-gray-50 rounded">
                    <span className="text-[11px] sm:text-xs md:text-sm text-gray-700">{service}</span>
                    <Badge variant="secondary" className="text-[9px] sm:text-[10px] md:text-xs">
                      {Math.floor(Math.random() * 10) + 5}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NearbyClinics;
