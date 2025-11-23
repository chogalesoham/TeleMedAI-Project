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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-2 sm:p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-2.5 sm:space-y-3 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-0.5 sm:space-y-1 md:space-y-2"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600 flex-shrink-0" />
            <h1 className="text-base sm:text-lg md:text-3xl font-bold text-gray-900 line-clamp-1 md:line-clamp-2">
              <span className="md:hidden">AI Specialist Recommendations</span>
              <span className="hidden md:inline">AI-Powered Specialist Recommendations</span>
            </h1>
          </div>
          <p className="text-[10px] sm:text-xs md:text-base text-gray-600 hidden sm:block">
            Personalized <span className="hidden md:inline">specialist </span>matches based on your health profile<span className="hidden md:inline"> and needs</span>
          </p>
        </motion.div>

        {/* AI Recommendation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-2 sm:p-3 md:p-6">
              <div className="flex items-start gap-2 sm:gap-2.5 md:gap-4">
                <div className="p-1.5 sm:p-2 md:p-3 bg-purple-100 rounded-lg md:rounded-full flex-shrink-0">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-6 md:w-6 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1 sm:space-y-1.5 md:space-y-2 min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm md:text-lg text-gray-900">
                    Based on Your Health Profile
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-snug md:leading-relaxed hidden sm:block">
                    <span className="md:hidden">Our AI analyzed your medical history to recommend specialists. Match scores indicate compatibility based on expertise and availability.</span>
                    <span className="hidden md:inline">Our AI has analyzed your medical history, current symptoms, and preferences to recommend the best specialists for your needs. Match scores indicate compatibility based on expertise, availability, and patient outcomes.</span>
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 pt-0.5 sm:pt-1 md:pt-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-[9px] sm:text-[10px] md:text-xs py-0.5 px-1.5 sm:px-2">
                      <span className="md:hidden">High Blood Pressure</span>
                      <span className="hidden md:inline">Recent Consultation: High Blood Pressure</span>
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[9px] sm:text-[10px] md:text-xs py-0.5 px-1.5 sm:px-2">
                      <span className="md:hidden">Hypertension</span>
                      <span className="hidden md:inline">Chronic Condition: Hypertension</span>
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-[9px] sm:text-[10px] md:text-xs py-0.5 px-1.5 sm:px-2">
                      <span className="md:hidden">English Speaking</span>
                      <span className="hidden md:inline">Preference: English Speaking</span>
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
            <CardContent className="p-2 sm:p-3 md:p-4">
              <div className="flex flex-col sm:flex-row md:grid md:grid-cols-3 gap-1.5 sm:gap-2 md:gap-4">
                <div className="relative flex-1 md:col-span-1">
                  <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400" />
                  <Input
                    placeholder="Search specialists, specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 md:pl-10 h-8 sm:h-9 md:h-10 text-xs md:text-sm"
                  />
                </div>

                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="h-8 sm:h-9 md:h-10 text-xs md:text-sm w-full sm:w-36 md:w-full">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs md:text-sm">
                      <span className="md:hidden">All</span>
                      <span className="hidden md:inline">All Specialties</span>
                    </SelectItem>
                    <SelectItem value="Cardiology" className="text-xs md:text-sm">Cardiology</SelectItem>
                    <SelectItem value="Neurology" className="text-xs md:text-sm">Neurology</SelectItem>
                    <SelectItem value="Orthopedics" className="text-xs md:text-sm">Orthopedics</SelectItem>
                    <SelectItem value="Dermatology" className="text-xs md:text-sm">Dermatology</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 sm:h-9 md:h-10 text-xs md:text-sm w-full sm:w-32 md:w-full">
                    <SelectValue placeholder="Sort by Match Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match" className="text-xs md:text-sm">Best Match</SelectItem>
                    <SelectItem value="rating" className="text-xs md:text-sm">
                      <span className="md:hidden">Top Rated</span>
                      <span className="hidden md:inline">Highest Rated</span>
                    </SelectItem>
                    <SelectItem value="experience" className="text-xs md:text-sm">
                      <span className="md:hidden">Experience</span>
                      <span className="hidden md:inline">Most Experienced</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Specialists List */}
        <div className="space-y-2 sm:space-y-2.5 md:space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredSpecialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 md:border-2 hover:border-blue-200">
                  <CardContent className="p-2.5 sm:p-3 md:p-6">
                    <div className="flex flex-col sm:flex-row md:flex-row gap-3 sm:gap-4 md:gap-6">
                      {/* Left: Doctor Info */}
                      <div className="flex gap-2 sm:gap-2.5 md:gap-4 flex-1 min-w-0">
                        <Avatar className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 border-2 md:border-4 border-white shadow-sm md:shadow-md flex-shrink-0">
                          <AvatarImage src={specialist.avatar} alt={specialist.name} />
                          <AvatarFallback className="text-sm sm:text-base md:text-xl">
                            {specialist.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1.5 sm:space-y-2 md:space-y-3 min-w-0">
                          <div>
                            <div className="flex items-start justify-between md:justify-start gap-2 mb-0.5 md:mb-1">
                              <h3 className="text-sm sm:text-base md:text-xl font-semibold text-gray-900 line-clamp-1 md:truncate">
                                {specialist.name}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="bg-purple-100 text-purple-700 font-semibold text-[9px] sm:text-[10px] md:text-xs py-0.5 px-1.5 md:px-2 flex-shrink-0"
                              >
                                <span className="md:hidden">{specialist.matchScore}%</span>
                                <span className="hidden md:inline">{specialist.matchScore}% Match</span>
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium truncate">{specialist.specialty}</p>
                            {specialist.subSpecialty && (
                              <p className="text-xs sm:text-sm text-gray-500 hidden md:block">{specialist.subSpecialty}</p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-4 text-[10px] sm:text-xs md:text-sm text-gray-600">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-current flex-shrink-0" />
                              <span className="font-semibold">{specialist.rating}</span>
                              <span>({specialist.reviewCount}<span className="hidden md:inline"> reviews</span>)</span>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <Award className="h-3 w-3 md:h-4 md:w-4 text-blue-600 flex-shrink-0" />
                              <span className="md:hidden">{specialist.experience}y</span>
                              <span className="hidden md:inline">{specialist.experience}y exp</span>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
                              <MapPin className="h-3 w-3 md:h-4 md:w-4 text-red-500 flex-shrink-0" />
                              <span className="truncate">{specialist.location}</span>
                            </div>
                          </div>

                          <div className="hidden sm:block space-y-1 md:space-y-1.5">
                            <p className="text-xs md:text-sm font-semibold text-gray-700 hidden md:block">Why recommended:</p>
                            {specialist.matchReasons.slice(0, 2).map((reason, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 md:gap-2 text-[10px] sm:text-xs md:text-sm">
                                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 line-clamp-1">{reason}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {specialist.treatmentFocus.slice(0, 3).map((focus) => (
                              <Badge
                                key={focus}
                                variant="outline"
                                className="text-[9px] sm:text-[10px] md:text-xs border-blue-200 text-blue-700 py-0 md:py-0.5 px-1.5"
                              >
                                <span className="md:hidden">{focus}</span>
                                <span className="hidden md:flex md:items-center">
                                  <SpecialtyIcon specialty={specialist.specialty} />
                                  <span className="ml-1">{focus}</span>
                                </span>
                              </Badge>
                            ))}
                            {specialist.treatmentFocus.length > 3 && (
                              <Badge variant="outline" className="text-[9px] sm:text-[10px] md:text-xs py-0 md:py-0.5 px-1.5">
                                +{specialist.treatmentFocus.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Booking Info */}
                      <div className="sm:w-44 md:w-64 flex flex-row sm:flex-col gap-2 md:gap-4 items-center sm:items-stretch">
                        <div className="flex-1 sm:flex-none p-2 sm:p-2.5 md:p-4 bg-gray-50 rounded-lg space-y-1 md:space-y-3">
                          <div className="flex sm:flex-col md:flex-row md:items-center md:justify-between items-center sm:items-start gap-1 sm:gap-0.5">
                            <span className="text-[10px] sm:text-xs md:text-sm text-gray-600 whitespace-nowrap">
                              <span className="md:hidden">Fee:</span>
                              <span className="hidden md:inline">Consultation Fee</span>
                            </span>
                            <span className="text-base sm:text-lg md:text-2xl font-bold text-gray-900">
                              ${specialist.consultationFee}
                            </span>
                          </div>
                          <div className="flex items-start gap-1 md:gap-2 text-[10px] sm:text-xs md:text-sm">
                            <Clock className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-600 hidden md:block">Next Available</p>
                              <p className="text-gray-600 md:hidden truncate">{specialist.nextAvailable.split(',')[0]}</p>
                              <p className="font-semibold text-gray-900 hidden md:block">{specialist.nextAvailable}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-1.5 md:gap-2 flex-1 sm:flex-none">
                          <Button className="flex-1 sm:w-full h-8 sm:h-9 md:h-10 text-[10px] sm:text-xs md:text-sm px-2 md:px-4" onClick={() => setSelectedSpecialist(specialist)}>
                            <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            <span className="hidden xs:inline">Book</span>
                            <span className="xs:hidden md:hidden">Book</span>
                            <span className="hidden md:inline">Book Appointment</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 sm:w-full h-8 sm:h-9 md:h-10 text-[10px] sm:text-xs md:text-sm px-2 md:px-4"
                            onClick={() => setSelectedSpecialist(specialist)}
                          >
                            <span className="md:hidden">View</span>
                            <span className="hidden md:inline">View Full Profile</span>
                            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
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
            className="text-center py-6 sm:py-8 md:py-12"
          >
            <Search className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-2 md:mb-4" />
            <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium md:px-4">
              <span className="md:hidden">No specialists found</span>
              <span className="hidden md:inline">No specialists found matching your criteria</span>
            </p>
            <p className="text-gray-500 text-xs md:text-sm mt-0.5 md:mt-1">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>

      {/* Specialist Detail Dialog */}
      <Dialog open={!!selectedSpecialist} onOpenChange={() => setSelectedSpecialist(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSpecialist && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex-shrink-0">
                    <AvatarImage src={selectedSpecialist.avatar} alt={selectedSpecialist.name} />
                    <AvatarFallback className="text-sm md:text-base">
                      {selectedSpecialist.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base sm:text-lg md:text-2xl truncate">{selectedSpecialist.name}</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm md:text-base">
                      {selectedSpecialist.specialty}
                      {selectedSpecialist.subSpecialty && ` - ${selectedSpecialist.subSpecialty}`}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3 sm:space-y-4 md:space-y-6 pt-2 sm:pt-3 md:pt-4">
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 mb-1.5 md:mb-2">Education</h4>
                  <ul className="space-y-1">
                    {selectedSpecialist.education.map((edu, idx) => (
                      <li key={idx} className="text-[10px] sm:text-xs md:text-sm text-gray-600 flex items-center gap-1.5 md:gap-2">
                        <Award className="h-3 w-3 md:h-4 md:w-4 text-blue-600 flex-shrink-0" />
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 mb-1.5 md:mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {selectedSpecialist.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="text-[9px] sm:text-[10px] md:text-xs py-0.5">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 mb-1.5 md:mb-2">Treatment Focus</h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {selectedSpecialist.treatmentFocus.map((focus) => (
                      <Badge key={focus} variant="outline" className="border-blue-200 text-[9px] sm:text-[10px] md:text-xs py-0.5">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 mb-1.5 md:mb-2">Languages</h4>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">{selectedSpecialist.languages.join(', ')}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 mb-1.5 md:mb-2">Hospital Affiliation</h4>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">{selectedSpecialist.hospital}</p>
                </div>

                <Button className="w-full h-9 sm:h-10 md:h-12 text-xs sm:text-sm md:text-base">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
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
