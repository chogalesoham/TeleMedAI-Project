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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nearby Medical Facilities</h1>
        <p className="text-gray-600">Find hospitals, clinics, and diagnostic centers near you</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search facilities, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Facility type" />
              </SelectTrigger>
              <SelectContent>
                {clinicTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="relative h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden">
                {/* Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map</h3>
                    <p className="text-gray-600 text-sm">
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
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                        {clinic.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Facilities List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found <span className="font-semibold text-gray-900">{filteredClinics.length}</span> facilities
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
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-lg ${getTypeColor(clinic.type)} flex items-center justify-center flex-shrink-0`}>
                          <TypeIcon className="w-7 h-7" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{clinic.name}</h3>
                              <Badge variant="outline" className="capitalize mt-1">
                                {clinic.type}
                              </Badge>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center gap-1 mb-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{clinic.rating}</span>
                              </div>
                              <p className="text-xs text-gray-600">{clinic.reviewCount} reviews</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{clinic.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Navigation className="w-4 h-4" />
                              <span className="font-medium text-primary">{clinic.distance} away</span>
                            </div>
                            {clinic.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{clinic.phone}</span>
                              </div>
                            )}
                            {clinic.hours && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{clinic.hours}</span>
                              </div>
                            )}
                          </div>

                          {/* Services */}
                          {clinic.services && clinic.services.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-600 mb-2">Services:</p>
                              <div className="flex flex-wrap gap-2">
                                {clinic.services.slice(0, 4).map((service, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                                {clinic.services.length > 4 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{clinic.services.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button className="flex-1">
                              <Navigation className="w-4 h-4 mr-2" />
                              Get Directions
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Phone className="w-4 h-4 mr-2" />
                              Call Now
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
        <div className="space-y-6">
          {/* Quick Filters */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Filters</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Open Now
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Highly Rated (4.5+)
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Navigation className="w-4 h-4 mr-2" />
                  Within 5km
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Services */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-red-900 mb-2">🚨 Emergency Services</h3>
              <p className="text-sm text-red-800 mb-4">
                For medical emergencies, call immediately:
              </p>
              <Button variant="destructive" className="w-full" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Call 911
              </Button>
            </CardContent>
          </Card>

          {/* Popular Services */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Popular Services</h3>
              <div className="space-y-2">
                {[
                  'Blood Test',
                  'X-Ray',
                  'Vaccination',
                  'Health Checkup',
                  'ECG'
                ].map((service) => (
                  <div key={service} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{service}</span>
                    <Badge variant="secondary" className="text-xs">
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
