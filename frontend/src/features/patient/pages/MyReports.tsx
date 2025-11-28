import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Search, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { aiService } from '@/services/aiService';

const MyReports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Get actual logged-in user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user._id || user.id;

    useEffect(() => {
        const fetchReports = async () => {
            if (!userId) {
                console.error('No user ID found');
                setIsLoading(false);
                return;
            }

            try {
                const data = await aiService.getUserReports(userId);
                setReports(data.data);
            } catch (error) {
                console.error('Failed to fetch reports', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [userId]);

    const filteredReports = reports.filter((report: any) =>
        report.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.differentialDiagnoses.some((d: any) => d.condition.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reports</h1>
                    <p className="text-gray-600">View your diagnostic history</p>
                </div>

                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search reports..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredReports.length === 0 ? (
                    <Card className="shadow-sm">
                        <CardContent className="p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No reports found</h3>
                            <p className="text-gray-500 mb-6">Start a symptom check to generate your first report</p>
                            <Button onClick={() => navigate('/patient-dashboard/symptom-intake')}>
                                Start Symptom Check
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredReports.map((report: any) => (
                            <Card
                                key={report._id}
                                className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/patient-dashboard/report/${report._id}`)}
                            >
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <Badge className={`${getUrgencyColor(report.urgency.level)} border`}>
                                            {report.urgency.level}
                                        </Badge>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {report.differentialDiagnoses[0]?.condition || "Diagnostic Report"}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {report.summary}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReports;
