import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PreDiagnosisReportViewer } from './PreDiagnosisReportViewer';
import appointmentService from '@/services/appointment.service';

interface Report {
    _id: string;
    symptoms: string;
    diagnosis: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string;
    createdAt: string;
}

interface ReportSelectorProps {
    onSelect: (reportId: string | null) => void;
    selectedReportId: string | null;
}

export const ReportSelector: React.FC<ReportSelectorProps> = ({ onSelect, selectedReportId }) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (selectedReportId && reports.length > 0) {
            const report = reports.find(r => r._id === selectedReportId);
            setSelectedReport(report || null);
        } else if (!selectedReportId) {
            setSelectedReport(null);
        }
    }, [selectedReportId, reports]);

    const fetchReports = async () => {
        try {
            const result = await appointmentService.getPatientReports();
            if (result.success) {
                setReports(result.data);
            }
        } catch (error) {
            console.error('Failed to load reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (report: Report) => {
        if (selectedReportId === report._id) {
            onSelect(null);
            setSelectedReport(null);
        } else {
            onSelect(report._id);
            setSelectedReport(report);
        }
        setIsOpen(false);
    };

    if (isLoading) {
        return <div className="h-10 w-full bg-gray-100 animate-pulse rounded-md" />;
    }

    if (reports.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                    Attach Pre-Diagnosis Report (Optional)
                </label>
                {selectedReport && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            onSelect(null);
                            setSelectedReport(null);
                        }}
                        className="text-red-500 hover:text-red-600 h-auto p-0"
                    >
                        Remove
                    </Button>
                )}
            </div>

            <div className="relative">
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        "w-full justify-between text-left font-normal h-auto py-3",
                        !selectedReport && "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedReport ? (
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <div className="flex flex-col items-start">
                                <span className="font-medium text-gray-900">
                                    Report from {new Date(selectedReport.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                    {selectedReport.diagnosis}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <span>Select a report to share with doctor...</span>
                    )}
                    <ChevronDown className={cn("w-4 h-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
                </Button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-white border rounded-md shadow-lg"
                        >
                            <ScrollArea className="h-[300px]">
                                <div className="p-2 space-y-2">
                                    {reports.map((report) => (
                                        <div
                                            key={report._id}
                                            onClick={() => handleSelect(report)}
                                            className={cn(
                                                "p-3 rounded-md cursor-pointer transition-colors border",
                                                selectedReportId === report._id
                                                    ? "bg-primary/5 border-primary/20"
                                                    : "hover:bg-gray-50 border-transparent"
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-500" />
                                                    <span className="font-medium text-sm">
                                                        {new Date(report.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <Badge variant="outline" className="text-xs capitalize">
                                                    {report.severity}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                                                <span className="font-medium">Diagnosis:</span> {report.diagnosis}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                <span className="font-medium">Symptoms:</span> {report.symptoms}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {selectedReport && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 text-sm text-blue-700 mb-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>
                            This report will be shared with the doctor to help them understand your condition better before the consultation.
                        </p>
                    </div>
                    <PreDiagnosisReportViewer report={selectedReport} compact />
                </motion.div>
            )}
        </div>
    );
};
