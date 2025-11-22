import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  User, 
  Download, 
  Eye, 
  Filter,
  Search,
  ChevronRight,
  Stethoscope,
  Pill,
  Activity,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockMedicalRecords } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const MedicalHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<typeof mockMedicalRecords[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const recordTypes = [
    { value: 'all', label: 'All Records', icon: FileText },
    { value: 'consultation', label: 'Consultations', icon: Stethoscope },
    { value: 'lab-report', label: 'Lab Reports', icon: Activity },
    { value: 'prescription', label: 'Prescriptions', icon: Pill },
    { value: 'imaging', label: 'Imaging', icon: ImageIcon },
  ];

  const filteredRecords = mockMedicalRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.doctorName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return Stethoscope;
      case 'lab-report':
        return Activity;
      case 'prescription':
        return Pill;
      case 'imaging':
        return ImageIcon;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-700';
      case 'lab-report':
        return 'bg-green-100 text-green-700';
      case 'prescription':
        return 'bg-purple-100 text-purple-700';
      case 'imaging':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const viewRecordDetails = (record: typeof mockMedicalRecords[0]) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical History</h1>
        <p className="text-gray-600">View and manage your complete medical records timeline</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search records, doctors, diagnoses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {recordTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline">
                <Calendar className="w-4 h-4 mr-2" />
                Timeline View
              </TabsTrigger>
              <TabsTrigger value="list">
                <FileText className="w-4 h-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-6">
              {/* Timeline by Year */}
              {[2024, 2023].map((year) => {
                const yearRecords = filteredRecords.filter(
                  r => new Date(r.date).getFullYear() === year
                );

                if (yearRecords.length === 0) return null;

                return (
                  <div key={year}>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary" className="text-lg px-4 py-1">{year}</Badge>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="space-y-4">
                      {yearRecords.map((record, index) => {
                        const TypeIcon = getTypeIcon(record.type);
                        return (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative"
                          >
                            {/* Timeline Line */}
                            {index < yearRecords.length - 1 && (
                              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 -mb-4" />
                            )}

                            {/* Record Card */}
                            <div className="flex gap-4">
                              {/* Date Badge */}
                              <div className="flex-shrink-0 w-12 text-center">
                                <div className="text-2xl font-bold text-gray-900">
                                  {new Date(record.date).getDate()}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                              </div>

                              {/* Card */}
                              <Card className="flex-1 hover:shadow-md transition-shadow cursor-pointer" onClick={() => viewRecordDetails(record)}>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-lg ${getTypeColor(record.type)} flex items-center justify-center flex-shrink-0`}>
                                      <TypeIcon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900">{record.title}</h4>
                                        <Badge variant="outline" className="capitalize">
                                          {record.type.replace('-', ' ')}
                                        </Badge>
                                      </div>
                                      
                                      {record.doctorName && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                          <User className="w-4 h-4" />
                                          <span>{record.doctorName}</span>
                                        </div>
                                      )}

                                      {record.summary && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                          {record.summary}
                                        </p>
                                      )}

                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          {record.fileUrl && (
                                            <Badge variant="secondary" className="text-xs">
                                              <FileText className="w-3 h-3 mr-1" />
                                              PDF
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Button size="sm" variant="ghost" className="h-8">
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                          </Button>
                                          {record.fileUrl && (
                                            <Button size="sm" variant="ghost" className="h-8">
                                              <Download className="w-4 h-4" />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredRecords.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No records found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-3">
              {filteredRecords.map((record, index) => {
                const TypeIcon = getTypeIcon(record.type);
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => viewRecordDetails(record)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg ${getTypeColor(record.type)} flex items-center justify-center flex-shrink-0`}>
                            <TypeIcon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{record.title}</h4>
                              <Badge variant="outline" className="capitalize text-xs">
                                {record.type.replace('-', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{new Date(record.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}</span>
                              {record.doctorName && (
                                <>
                                  <span>•</span>
                                  <span>{record.doctorName}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Record Summary</h3>
              <div className="space-y-3">
                {recordTypes.slice(1).map((type) => {
                  const count = mockMedicalRecords.filter(r => r.type === type.value).length;
                  return (
                    <div key={type.value} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{type.label}</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Doctors */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Doctors</h3>
              <div className="space-y-3">
                {Array.from(new Set(mockMedicalRecords.map(r => r.doctorName).filter(Boolean))).slice(0, 3).map((doctorName) => (
                  <div key={doctorName} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`/doctors/${doctorName?.toLowerCase().replace('dr. ', '').split(' ')[0]}.jpg`} />
                      <AvatarFallback>{doctorName?.[4]}{doctorName?.split(' ')[1]?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{doctorName}</p>
                      <p className="text-xs text-gray-600">
                        {mockMedicalRecords.filter(r => r.doctorName === doctorName).length} records
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download All Records
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Request Records
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Record Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRecord?.title}</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <Badge variant="outline" className="capitalize">
                    {selectedRecord.type.replace('-', ' ')}
                  </Badge>
                </div>
                {selectedRecord.doctorName && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium">{selectedRecord.doctorName}</p>
                  </div>
                )}
              </div>

              {selectedRecord.summary && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Summary</p>
                  <p className="text-gray-900">{selectedRecord.summary}</p>
                </div>
              )}

              {selectedRecord.fileUrl && (
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Document
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalHistory;
