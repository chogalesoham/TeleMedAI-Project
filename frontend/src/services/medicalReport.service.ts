import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface MedicalReportMeta {
    fileName: string;
    fileType: string;
    fileSize: number;
    documentType: 'lab-report' | 'prescription' | 'imaging' | 'consultation' | 'other';
    notes?: string;
    uploadedAt: string;
}

export interface Finding {
    parameter: string;
    value: string;
    normal_range: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical' | 'Unknown';
}

export interface Analysis {
    report_type: string;
    findings: Finding[];
    summary: string;
    recommendations: string[];
    concerns: string[];
    disclaimer: string;
}

export interface MedicalReport {
    _id: string;
    userId: string;
    reportMeta: MedicalReportMeta;
    analysis: Analysis;
    status: 'uploaded' | 'analyzed' | 'reviewed' | 'archived';
    tags?: string[];
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    reportName?: string;
    reportSummary?: string;
}

export interface CreateMedicalReportPayload {
    userId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    documentType: string;
    notes?: string;
    uploadedAt?: string;
    analysis: Analysis;
}

export interface MedicalReportStats {
    total: number;
    archived: number;
    active: number;
    byType: Array<{
        _id: string;
        count: number;
    }>;
}

/**
 * Create a new medical report
 */
export const createMedicalReport = async (
    payload: CreateMedicalReportPayload
): Promise<MedicalReport> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/medical-reports`, payload);
        return response.data.data;
    } catch (error: any) {
        console.error('Error creating medical report:', error);
        throw new Error(error.response?.data?.message || 'Failed to create medical report');
    }
};

/**
 * Get all medical reports for a user
 */
export const getUserMedicalReports = async (
    userId: string,
    options?: {
        documentType?: string;
        limit?: number;
        skip?: number;
        includeArchived?: boolean;
    }
): Promise<{ reports: MedicalReport[]; total: number; count: number }> => {
    try {
        const params = new URLSearchParams();
        if (options?.documentType) params.append('documentType', options.documentType);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.skip) params.append('skip', options.skip.toString());
        if (options?.includeArchived !== undefined) {
            params.append('includeArchived', options.includeArchived.toString());
        }

        const response = await axios.get(
            `${API_BASE_URL}/medical-reports/user/${userId}?${params.toString()}`
        );

        return {
            reports: response.data.data,
            total: response.data.total,
            count: response.data.count
        };
    } catch (error: any) {
        console.error('Error fetching medical reports:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch medical reports');
    }
};

/**
 * Get a single medical report by ID
 */
export const getMedicalReportById = async (reportId: string): Promise<MedicalReport> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/medical-reports/${reportId}`);
        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching medical report:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch medical report');
    }
};

/**
 * Update a medical report
 */
export const updateMedicalReport = async (
    reportId: string,
    updates: Partial<MedicalReport>
): Promise<MedicalReport> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/medical-reports/${reportId}`, updates);
        return response.data.data;
    } catch (error: any) {
        console.error('Error updating medical report:', error);
        throw new Error(error.response?.data?.message || 'Failed to update medical report');
    }
};

/**
 * Delete a medical report
 */
export const deleteMedicalReport = async (reportId: string): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/medical-reports/${reportId}`);
    } catch (error: any) {
        console.error('Error deleting medical report:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete medical report');
    }
};

/**
 * Archive or unarchive a medical report
 */
export const toggleArchiveMedicalReport = async (
    reportId: string,
    isArchived: boolean
): Promise<MedicalReport> => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/medical-reports/${reportId}/archive`,
            { isArchived }
        );
        return response.data.data;
    } catch (error: any) {
        console.error('Error archiving medical report:', error);
        throw new Error(error.response?.data?.message || 'Failed to archive medical report');
    }
};

/**
 * Get report statistics for a user
 */
export const getUserReportStats = async (userId: string): Promise<MedicalReportStats> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/medical-reports/user/${userId}/stats`);
        return response.data.data;
    } catch (error: any) {
        console.error('Error fetching report stats:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch report statistics');
    }
};
