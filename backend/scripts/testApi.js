const axios = require('axios');

const testApi = async () => {
    try {
        console.log('Testing API: http://localhost:5000/api/doctor/onboarding/nearby');
        const response = await axios.get('http://localhost:5000/api/doctor/onboarding/nearby');

        console.log('Status:', response.status);
        console.log('Data count:', response.data.count);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('API Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
};

testApi();
