import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText, AlertTriangle, Activity, Pill, Utensils, ArrowLeft, Download,
    Share2, CheckCircle, TestTube, Calendar, Dumbbell, Loader2, AlertCircle as AlertIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { aiService } from '@/services/aiService';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                if (id) {
                    const data = await aiService.getReportById(id);
                    setReport(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch report', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <AlertIcon className="w-12 h-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-700 mb-4">Report Not Found</h2>
                <Button onClick={() => navigate('/patient-dashboard/my-reports')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Reports
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
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/patient-dashboard/my-reports')}
                            className="mb-2 -ml-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">Diagnostic Report</h1>
                        <p className="text-gray-600 mt-1">
                            {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" /> Download
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
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

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    Symptoms
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.symptoms.map((symptom: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            {symptom}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Possible Conditions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {report.differentialDiagnoses.map((dx: any, idx: number) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900">{dx.condition}</span>
                                            <span className="text-sm text-gray-600">{dx.probability}%</span>
                                        </div>
                                        <Progress value={dx.probability} className="h-2" />
                                        <p className="text-sm text-gray-600">{dx.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {report.tests && report.tests.length > 0 && (
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TestTube className="w-5 h-5 text-blue-600" />
                                        Recommended Tests
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {report.tests.map((test: string, i: number) => (
                                            <li key={i} className="flex items-center gap-2 text-gray-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                                {test}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {report.lifestyleAdvice && report.lifestyleAdvice.length > 0 && (
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Dumbbell className="w-5 h-5 text-blue-600" />
                                            Lifestyle
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {report.lifestyleAdvice.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {report.dietPlan && report.dietPlan.length > 0 && (
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <Utensils className="w-5 h-5 text-blue-600" />
                                            Diet
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {report.dietPlan.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                                    Urgency
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge className={`${getUrgencyColor(report.urgency.level)} border text-base px-3 py-1`}>
                                    {report.urgency.level}
                                </Badge>
                                <p className="text-sm text-gray-600 mt-3">{report.urgency.description}</p>
                            </CardContent>
                        </Card>

                        {report.medications && report.medications.length > 0 && (
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Pill className="w-5 h-5 text-blue-600" />
                                        Medications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {report.medications.map((med: any, i: number) => (
                                            <li key={i} className="text-sm border-b last:border-0 pb-3 last:pb-0">
                                                <div className="font-semibold text-gray-900">{med.name}</div>
                                                <div className="text-gray-600 mt-1">{med.dosage}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {report.followUpRecommendation && (
                            <Card className="shadow-sm bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        Next Steps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700 mb-4">{report.followUpRecommendation}</p>
                                    <Button
                                        className="w-full"
                                        onClick={() => navigate('/patient-dashboard/doctor-selection')}
                                    >
                                        Book Specialist
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
