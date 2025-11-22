import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Search, Filter, Upload, Clock, User, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const reports = [
  {
    id: 1,
    patient: "Priya Sharma",
    type: "Consultation Summary",
    date: "2025-11-22",
    status: "completed",
    size: "2.4 MB",
    content: "Comprehensive consultation summary including diagnosis, treatment plan, and follow-up recommendations"
  },
  {
    id: 2,
    patient: "Rajesh Kumar",
    type: "Lab Report Analysis",
    date: "2025-11-21",
    status: "completed",
    size: "1.8 MB",
    content: "Blood test results with AI-analyzed abnormalities and clinical recommendations"
  },
  {
    id: 3,
    patient: "Anjali Verma",
    type: "Prescription",
    date: "2025-11-20",
    status: "pending",
    size: "0.5 MB",
    content: "Generated prescription with dosage, frequency, and drug interaction warnings"
  },
  {
    id: 4,
    patient: "Vikram Desai",
    type: "Medical History",
    date: "2025-11-19",
    status: "completed",
    size: "3.2 MB",
    content: "Complete medical history with previous diagnoses and treatment records"
  },
  {
    id: 5,
    patient: "Neha Patel",
    type: "X-Ray Report",
    date: "2025-11-18",
    status: "completed",
    size: "5.1 MB",
    content: "Radiologist's interpretation of chest X-ray with findings and recommendations"
  },
  {
    id: 6,
    patient: "Arjun Singh",
    type: "ECG Report",
    date: "2025-11-17",
    status: "completed",
    size: "0.8 MB",
    content: "Electrocardiogram analysis with heart rate and rhythm assessment"
  }
];

export const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);
  const [filterType, setFilterType] = useState('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reports.length,
    completed: reports.filter(r => r.status === 'completed').length,
    pending: reports.filter(r => r.status === 'pending').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Reports & Documents
          </h1>
          <p className="text-muted-foreground mt-1">View and manage patient reports</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent">
          <Upload className="w-4 h-4 mr-2" />
          Upload Report
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Reports', value: stats.total, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
          { label: 'Completed', value: stats.completed, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
          { label: 'Pending', value: stats.pending, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn("p-4 border-0 shadow-lg", stat.bg)}>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 border-0 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'completed', 'pending'].map(type => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  onClick={() => setFilterType(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-3"
        >
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => setSelectedReport(report)}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all",
                selectedReport?.id === report.id
                  ? "bg-blue-50 border-blue-200 shadow-md"
                  : "bg-muted/50 border-border/40 hover:border-border"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{report.type}</h3>
                    <Badge className={report.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.patient}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                    <div>{report.size}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Report Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {selectedReport ? (
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedReport.type}</h3>
                  <p className="text-sm text-muted-foreground">{selectedReport.patient}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedReport.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">File Size</p>
                  <p className="font-medium">{selectedReport.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={selectedReport.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedReport.content}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button className="w-full bg-gradient-to-r from-primary to-accent">
                  <Eye className="w-4 h-4 mr-2" />
                  View Report
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-0 shadow-lg text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a report to view details</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
