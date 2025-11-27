import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText, Download, Share2, Activity, AlertCircle,
    CheckCircle2, Pill, Heart, Utensils, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export const FinalSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { report } = location.state || {};

    if (!report) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-muted-foreground">No report data found.</p>
                <Button onClick={() => navigate('/patient-dashboard')}>Go to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-5xl space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" onClick={() => navigate('/patient-dashboard')}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Medical Report</h1>
                    <p className="text-gray-500">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Button>
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Case Summary */}
                    <Card className="border-l-4 border-l-primary shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <FileText className="w-5 h-5 text-primary" /> Case Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">{report.summary}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {report.symptoms.map((s: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="px-3 py-1">{s}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Differential Diagnosis */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Activity className="w-5 h-5 text-blue-600" /> Differential Diagnosis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {report.differentialDiagnoses.map((dx: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-gray-900">{dx.condition}</h4>
                                        <Badge variant={dx.severity === 'High' ? 'destructive' : 'outline'}>
                                            {dx.probability}% Probability
                                        </Badge>
                                    </div>
                                    <Progress value={dx.probability} className="h-2" />
                                    <p className="text-sm text-gray-600">{dx.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Lifestyle & Diet */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Card className="shadow-sm bg-green-50/50 border-green-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                                    <Heart className="w-5 h-5" /> Lifestyle Advice
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.lifestyleAdvice.map((advice: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                            {advice}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm bg-orange-50/50 border-orange-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
                                    <Utensils className="w-5 h-5" /> Diet Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.dietPlan.length > 0 ? report.dietPlan.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-orange-900">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-600" />
                                            {item}
                                        </li>
                                    )) : <p className="text-sm text-orange-800 italic">No specific diet restrictions.</p>}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Urgency */}
                    <Card className={`shadow-sm border-l-4 ${report.urgency?.level === 'High' || report.urgency?.level === 'Critical'
                            ? 'border-l-red-500 bg-red-50/30'
                            : 'border-l-yellow-500 bg-yellow-50/30'
                        }`}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <AlertCircle className="w-5 h-5" /> Urgency Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Level:</span>
                                <Badge variant={report.urgency?.level === 'High' ? 'destructive' : 'default'}>
                                    {report.urgency?.level || 'Moderate'}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{report.urgency?.description}</p>
                        </CardContent>
                    </Card>

                    {/* OTC Meds */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Pill className="w-5 h-5 text-purple-600" /> OTC Suggestions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {report.medications.length > 0 ? (
                                <div className="space-y-3">
                                    {report.medications.map((med: any, i: number) => (
                                        <div key={i} className="bg-gray-50 p-3 rounded-lg text-sm">
                                            <div className="font-semibold text-gray-900">{med.name}</div>
                                            <div className="text-gray-500 text-xs">{med.dosage}</div>
                                            <div className="text-gray-600 mt-1">{med.purpose}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No OTC medications suggested.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Red Flags */}
                    {report.redFlags && report.redFlags.length > 0 && (
                        <Card className="shadow-sm border-red-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                                    <AlertCircle className="w-5 h-5" /> Red Flags
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.redFlags.map((flag: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
