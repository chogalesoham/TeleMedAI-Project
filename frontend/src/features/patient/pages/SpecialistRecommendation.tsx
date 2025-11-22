import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Brain,
  Heart,
  Bone,
  Eye,
  Ear,
  Baby,
  Activity,
  Stethoscope,
  Search,
  MapPin,
  Star,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  subSpecialty?: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  experience: number;
  location: string;
  hospital: string;
  languages: string[];
  consultationFee: number;
  nextAvailable: string;
  matchScore: number;
  matchReasons: string[];
  education: string[];
  certifications: string[];
  treatmentFocus: string[];
}

const specialtyIcons: Record<string, any> = {
  Cardiology: Heart,
  Neurology: Brain,
  Orthopedics: Bone,
  Ophthalmology: Eye,
  ENT: Ear,
  Pediatrics: Baby,
  Dermatology: Activity,
  'General Medicine': Stethoscope,
};

const mockSpecialists: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    specialty: 'Cardiology',
    subSpecialty: 'Interventional Cardiology',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4.9,
    reviewCount: 342,
    experience: 15,
    location: 'Downtown Medical Center',
    hospital: 'City Heart Institute',
    languages: ['English', 'Spanish'],
    consultationFee: 150,
    nextAvailable: 'Tomorrow, 10:00 AM',
    matchScore: 95,
    matchReasons: [
      'Specializes in your diagnosed condition',
      'Excellent patient reviews',
      'Available within 24 hours',
      'Accepts your insurance',
    ],
    education: ['Harvard Medical School', 'Johns Hopkins Cardiology Fellowship'],
    certifications: ['Board Certified Cardiologist', 'FACC', 'FSCAI'],
    treatmentFocus: ['Heart Disease', 'Hypertension', 'Arrhythmia', 'Heart Failure'],
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    subSpecialty: 'Headache Medicine',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 4.8,
    reviewCount: 289,
    experience: 12,
    location: 'Westside Neuro Clinic',
    hospital: 'Brain & Spine Center',
    languages: ['English', 'Mandarin'],
    consultationFee: 140,
    nextAvailable: 'Today, 3:00 PM',
    matchScore: 92,
    matchReasons: [
      'Expert in chronic headaches',
      'Same-day availability',
      'High success rate',
      'Comprehensive approach',
    ],
    education: ['Stanford Medical School', 'UCSF Neurology Residency'],
    certifications: ['Board Certified Neurologist', 'Headache Specialist'],
    treatmentFocus: ['Migraines', 'Chronic Headaches', 'Neuropathy', 'Seizures'],
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Orthopedics',
    subSpecialty: 'Sports Medicine',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 4.9,
    reviewCount: 411,
    experience: 18,
    location: 'Sports Medicine Center',
    hospital: 'Athletic Care Hospital',
    languages: ['English', 'Spanish', 'French'],
    consultationFee: 160,
    nextAvailable: 'Dec 28, 2:00 PM',
    matchScore: 88,
    matchReasons: [
      'Specializes in joint injuries',
      'Minimally invasive techniques',
      'Fast recovery protocols',
      'Athlete treatment expert',
    ],
    education: ['UCLA Medical School', 'Mayo Clinic Sports Medicine Fellowship'],
    certifications: ['Board Certified Orthopedic Surgeon', 'CAQ Sports Medicine'],
    treatmentFocus: ['Joint Pain', 'Sports Injuries', 'Arthritis', 'Ligament Tears'],
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Dermatology',
    subSpecialty: 'Cosmetic & Medical',
    avatar: 'https://i.pravatar.cc/150?img=13',
    rating: 4.7,
    reviewCount: 256,
    experience: 10,
    location: 'Skin Health Clinic',
    hospital: 'Dermatology Associates',
    languages: ['English'],
    consultationFee: 130,
    nextAvailable: 'Dec 29, 11:00 AM',
    matchScore: 85,
    matchReasons: [
      'Comprehensive skin care',
      'Modern treatment options',
      'Flexible scheduling',
      'Patient-focused approach',
    ],
    education: ['Columbia Medical School', 'NYU Dermatology Residency'],
    certifications: ['Board Certified Dermatologist', 'Cosmetic Dermatology'],
    treatmentFocus: ['Acne', 'Eczema', 'Skin Cancer Screening', 'Anti-aging'],
  },
];

const SpecialistRecommendation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  const filteredSpecialists = mockSpecialists
    .filter((specialist) => {
      const matchesSearch =
        specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialist.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialist.hospital.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === 'all' || specialist.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experience - a.experience;
      return 0;
    });

  const SpecialtyIcon = ({ specialty }: { specialty: string }) => {
    const Icon = specialtyIcons[specialty] || Stethoscope;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              AI-Powered Specialist Recommendations
            </h1>
          </div>
          <p className="text-gray-600">
            Personalized specialist matches based on your health profile and needs
          </p>
        </motion.div>

        {/* AI Recommendation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-900">
                    Based on Your Health Profile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Our AI has analyzed your medical history, current symptoms, and preferences to
                    recommend the best specialists for your needs. Match scores indicate
                    compatibility based on expertise, availability, and patient outcomes.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Recent Consultation: High Blood Pressure
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Chronic Condition: Hypertension
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Preference: English Speaking
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search specialists, specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by Match Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Best Match</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Specialists List */}
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSpecialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left: Doctor Info */}
                      <div className="flex gap-4 flex-1">
                        <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                          <AvatarImage src={specialist.avatar} alt={specialist.name} />
                          <AvatarFallback className="text-xl">
                            {specialist.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {specialist.name}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="bg-purple-100 text-purple-700 font-semibold"
                              >
                                {specialist.matchScore}% Match
                              </Badge>
                            </div>
                            <p className="text-gray-600 font-medium">{specialist.specialty}</p>
                            {specialist.subSpecialty && (
                              <p className="text-sm text-gray-500">{specialist.subSpecialty}</p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-semibold">{specialist.rating}</span>
                              <span>({specialist.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-blue-600" />
                              <span>{specialist.experience} years exp</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span>{specialist.location}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Why recommended:</p>
                            <div className="space-y-1">
                              {specialist.matchReasons.slice(0, 3).map((reason, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-600">{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {specialist.treatmentFocus.slice(0, 4).map((focus) => (
                              <Badge
                                key={focus}
                                variant="outline"
                                className="text-xs border-blue-200 text-blue-700"
                              >
                                <SpecialtyIcon specialty={specialist.specialty} />
                                <span className="ml-1">{focus}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Booking Info */}
                      <div className="lg:w-64 space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Consultation Fee</span>
                            <span className="text-xl font-bold text-gray-900">
                              ${specialist.consultationFee}
                            </span>
                          </div>

                          <div className="flex items-start gap-2 text-sm">
                            <Clock className="h-4 w-4 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-gray-600">Next Available</p>
                              <p className="font-semibold text-gray-900">
                                {specialist.nextAvailable}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button className="w-full" onClick={() => setSelectedSpecialist(specialist)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Appointment
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setSelectedSpecialist(specialist)}
                          >
                            View Full Profile
                            <ArrowRight className="h-4 w-4 ml-2" />
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

        {filteredSpecialists.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No specialists found matching your criteria</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>

      {/* Specialist Detail Dialog */}
      <Dialog open={!!selectedSpecialist} onOpenChange={() => setSelectedSpecialist(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSpecialist && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedSpecialist.avatar} alt={selectedSpecialist.name} />
                    <AvatarFallback>
                      {selectedSpecialist.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedSpecialist.name}</DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedSpecialist.specialty}
                      {selectedSpecialist.subSpecialty && ` - ${selectedSpecialist.subSpecialty}`}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                  <ul className="space-y-1">
                    {selectedSpecialist.education.map((edu, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialist.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Treatment Focus</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialist.treatmentFocus.map((focus) => (
                      <Badge key={focus} variant="outline" className="border-blue-200">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Languages</h4>
                  <p className="text-sm text-gray-600">{selectedSpecialist.languages.join(', ')}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Hospital Affiliation</h4>
                  <p className="text-sm text-gray-600">{selectedSpecialist.hospital}</p>
                </div>

                <Button className="w-full" size="lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Appointment with {selectedSpecialist.name.split(' ')[1]}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecialistRecommendation;
