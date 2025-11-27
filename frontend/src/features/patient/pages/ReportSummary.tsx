import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FileText, CheckCircle, Home, Eye, ArrowRight, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const ReportSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { report } = location.state || {};

    if (!report) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <h2 className="text-xl font-bold mb-4 text-gray-700">No Report Found</h2>
                <Button onClick={() => navigate('/patient-dashboard/symptom-intake')}>
                    Start New Checkup
                </Button>
            </div>
        );
    }

    const getUrgencyColor = (level: string) => {
        const colors: any = {
            critical: 'bg-red-100 text-red-800 border-red-200',
            high: 'bg-orange-100 text-orange-800 border-orange-200',
            moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            low: 'bg-green-100 text-green-800 border-green-200'
        };
        return colors[level.toLowerCase()] || colors.moderate;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto space-y-6">
                <Card className="shadow-sm bg-blue-600 text-white">
                    <CardContent className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Report Generated!</h1>
                        <p className="text-blue-100 mb-6">Your AI diagnostic analysis is ready</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50"
                                onClick={() => navigate(`/patient-dashboard/report/${report._id}`)}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                View Full Report
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="shadow-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {report.differentialDiagnoses?.length || 0}
                            </div>
                            <div className="text-sm text-gray-600">Conditions Analyzed</div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-6 text-center">
                            <Badge className={`${getUrgencyColor(report.urgency.level)} border text-lg px-3 py-1 mb-2`}>
                                {report.urgency.level}
                            </Badge>
                            <div className="text-sm text-gray-600">Urgency Level</div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {report.lifestyleAdvice?.length || 0}
                            </div>
                            <div className="text-sm text-gray-600">Recommendations</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 leading-relaxed">{report.summary}</p>
                    </CardContent>
                </Card>

                {report.differentialDiagnoses && report.differentialDiagnoses.length > 0 && (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Top Possible Conditions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {report.differentialDiagnoses.slice(0, 3).map((dx: any, idx: number) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">{dx.condition}</span>
                                        <Badge variant="outline">{dx.probability}%</Badge>
                                    </div>
                                    <Progress value={dx.probability} className="h-2" />
                                    <p className="text-sm text-gray-600">{dx.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {report.lifestyleAdvice && report.lifestyleAdvice.length > 0 && (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Key Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {report.lifestyleAdvice.slice(0, 5).map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-wrap justify-center gap-3 pb-6">
                    <Button
                        size="lg"
                        onClick={() => navigate('/patient-dashboard')}
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/patient-dashboard/doctor-selection')}
                    >
                        Book Specialist
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReportSummary;
