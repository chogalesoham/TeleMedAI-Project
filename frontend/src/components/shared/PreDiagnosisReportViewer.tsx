import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Activity, Stethoscope, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ReportData {
    _id: string;
    symptoms: string;
    diagnosis: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string;
    createdAt: string;
}

interface PreDiagnosisReportViewerProps {
    report: ReportData;
    compact?: boolean;
}

export const PreDiagnosisReportViewer: React.FC<PreDiagnosisReportViewerProps> = ({ report, compact = false }) => {
    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <Card className="w-full bg-white shadow-sm">
            <CardHeader className={compact ? 'p-4' : 'p-6'}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Pre-Diagnosis Report
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3 text-gray-500" />
                                <p className="text-xs text-gray-500">
                                    Generated on {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Badge className={`${getSeverityColor(report.severity)} capitalize`}>
                        {report.severity} Severity
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className={compact ? 'p-4 pt-0 space-y-4' : 'p-6 pt-0 space-y-6'}>
                {/* AI Diagnosis */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Stethoscope className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">AI Suggested Diagnosis</h4>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                {report.diagnosis}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Symptoms */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <h4 className="text-sm font-semibold text-gray-700">Reported Symptoms</h4>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                        {report.symptoms}
                    </p>
                </div>

                {/* Recommendations */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-gray-500" />
                        <h4 className="text-sm font-semibold text-gray-700">AI Recommendations</h4>
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                        <ul className="list-disc list-inside space-y-1">
                            {report.recommendations.split('\n').map((rec, idx) => (
                                rec.trim() && <li key={idx}>{rec.replace(/^[•-]\s*/, '')}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
