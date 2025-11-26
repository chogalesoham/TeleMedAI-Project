import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, FileText, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminService from '@/services/admin.service';
import { toast } from 'sonner';

interface PendingDoctor {
    id: string;
    name: string;
    email: string;
    phone: string;
    registrationNumber: string;
    registrationCouncil: string;
    specialties: string[];
    languages: string[];
    consultationModes: string[];
    consultationFee: {
        currency: string;
        amount: number;
        mode: string;
    };
    verificationDocuments: string[];
    onboardingCompleted: boolean;
    createdAt: string;
    approvalStatus: string;
}

export const PendingDoctors = () => {
    const [doctors, setDoctors] = useState<PendingDoctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<PendingDoctor | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingDoctors();
    }, []);

    const fetchPendingDoctors = async () => {
        setIsLoading(true);
        try {
            const response = await AdminService.getPendingDoctors();
            if (response.success && response.data) {
                setDoctors(response.data.doctors || []);
            }
        } catch (error) {
            console.error('Error fetching pending doctors:', error);
            toast.error('Failed to load pending doctors');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (doctorId: string) => {
        setActionLoading(doctorId);
        try {
            const response = await AdminService.approveDoctor(doctorId);
            if (response.success) {
                toast.success('Doctor approved successfully!');
                fetchPendingDoctors(); // Refresh list
            } else {
                toast.error(response.error || 'Failed to approve doctor');
            }
        } catch (error) {
            toast.error('Failed to approve doctor');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!selectedDoctor || !rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        setActionLoading(selectedDoctor.id);
        try {
            const response = await AdminService.rejectDoctor(selectedDoctor.id, rejectionReason);
            if (response.success) {
                toast.success('Doctor rejected');
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedDoctor(null);
                fetchPendingDoctors(); // Refresh list
            } else {
                toast.error(response.error || 'Failed to reject doctor');
            }
        } catch (error) {
            toast.error('Failed to reject doctor');
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (doctors.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Approvals</h3>
                <p className="text-gray-600">All doctors have been reviewed</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Pending Doctor Approvals</h2>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {doctors.length} Pending
                </span>
            </div>

            <div className="grid gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h3>
                                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {doctor.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {doctor.phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        {doctor.registrationNumber}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(doctor.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleApprove(doctor.id)}
                                    disabled={actionLoading === doctor.id}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {actionLoading === doctor.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setSelectedDoctor(doctor);
                                        setShowRejectModal(true);
                                    }}
                                    disabled={actionLoading === doctor.id}
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-700 mb-1">Specialties</p>
                                    <div className="flex flex-wrap gap-1">
                                        {doctor.specialties.map((spec, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700 mb-1">Languages</p>
                                    <p className="text-gray-600">{doctor.languages.join(', ')}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700 mb-1">Consultation Fee</p>
                                    <p className="text-gray-600">
                                        {doctor.consultationFee.currency} {doctor.consultationFee.amount} / {doctor.consultationFee.mode}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {doctor.verificationDocuments.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="font-medium text-gray-700 mb-2">Verification Documents</p>
                                <div className="flex gap-2">
                                    {doctor.verificationDocuments.map((doc, idx) => (
                                        <a
                                            key={idx}
                                            href={doc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Document {idx + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Doctor Application</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a reason for rejecting {selectedDoctor?.name}'s application:
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full p-3 border rounded-lg resize-none mb-4"
                            rows={4}
                            required
                        />
                        <div className="flex gap-3 justify-end">
                            <Button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                    setSelectedDoctor(null);
                                }}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleReject}
                                disabled={!rejectionReason.trim() || actionLoading === selectedDoctor?.id}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {actionLoading === selectedDoctor?.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Reject'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingDoctors;
