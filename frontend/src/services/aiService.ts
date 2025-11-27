import axios from 'axios';

const FLASK_API_URL = 'http://localhost:8000';
const NODE_API_URL = 'http://localhost:5000/api';

export const aiService = {
    // Flask AI Endpoints
    initialProblem: async (problemText: string) => {
        const response = await axios.post(`${FLASK_API_URL}/initial-problem`, { problem_text: problemText });
        return response.data;
    },

    nextQuestion: async (history: any[], patientInfo: any) => {
        const response = await axios.post(`${FLASK_API_URL}/next-question`, { history, patient_info: patientInfo });
        return response.data;
    },

    extractEntities: async (text: string) => {
        const response = await axios.post(`${FLASK_API_URL}/extract-entities`, { text });
        return response.data;
    },

    finalSummary: async (history: any[], patientInfo: any) => {
        const response = await axios.post(`${FLASK_API_URL}/final-summary`, { history, patient_info: patientInfo });
        return response.data;
    },

    // Node.js Backend Endpoints
    savePreDiagnosis: async (data: any) => {
        const response = await axios.post(`${NODE_API_URL}/ai/save-pre-diagnosis`, data);
        return response.data;
    },

    createReport: async (data: any) => {
        const response = await axios.post(`${NODE_API_URL}/reports/create`, data);
        return response.data;
    },

    getUserReports: async (userId: string) => {
        const response = await axios.get(`${NODE_API_URL}/reports/user/${userId}`);
        return response.data;
    },

    getReportById: async (id: string) => {
        const response = await axios.get(`${NODE_API_URL}/reports/${id}`);
        return response.data;
    }
};
