import os
import google.generativeai as genai
from database import get_patient_data
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("WARNING: GOOGLE_API_KEY not found.")

genai.configure(api_key=GOOGLE_API_KEY)

# Define the model
# Using gemini-1.5-flash as it is free and fast, or gemini-pro
MODEL_NAME = "gemini-2.5-flash" 

# System instruction for the agent
SYSTEM_INSTRUCTION = """
You are an advanced AI Health Assistant for TeleMedAI. 
Your goal is to provide personalized health assistance to patients based on their medical profile.

You have access to the patient's medical records, including:
- Basic Health Profile (Height, Weight, BMI, Blood Group)
- Medical History (Chronic diseases, surgeries, allergies)
- Current Medications
- Lifestyle (Smoking, Alcohol, Exercise)

RULES:
1. ALWAYS verify the patient's identity context (you will be provided with their data).
2. Use the patient's specific data to answer questions. For example, if they ask "What meds am I on?", list their actual medications.
3. If you don't have specific data (e.g., recent blood test results not in the profile), say so and advise seeing a doctor.
4. DO NOT provide medical diagnoses. You are an assistant, not a doctor. Always include a disclaimer for serious symptoms.
5. Be empathetic, professional, and concise.
6. If the user asks about booking appointments, guide them to the appointment section (you can't book directly yet, but you can guide).

When answering:
- Address the user by name if available.
- Reference their specific conditions if relevant.
"""

generation_config = {
  "temperature": 0.7,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

async def chat_with_agent(user_id: str, message: str, history: list = []):
    """
    Handles a chat request for a specific user.
    Fetches patient data to prime the context.
    """
    try:
        # 1. Fetch Patient Data
        patient_data = await get_patient_data(user_id)
        
        if not patient_data:
            return {
                "response": "I'm sorry, I couldn't access your patient records. Please ensure you have completed the onboarding process.",
                "error": "Patient data not found"
            }

        # 2. Construct Context
        # We inject patient data into the system prompt or the first message
        patient_context = f"""
        CURRENT PATIENT CONTEXT:
        Name: {patient_data.get('patientName', 'Patient')}
        ID: {patient_data.get('_id')}
        User ID: {patient_data.get('userId')}
        
        BASIC HEALTH PROFILE:
        - Gender: {patient_data.get('basicHealthProfile', {}).get('gender', 'N/A')}
        - Date of Birth: {patient_data.get('basicHealthProfile', {}).get('dateOfBirth', 'N/A')}
        - Blood Group: {patient_data.get('basicHealthProfile', {}).get('bloodGroup', 'N/A')}
        - Height: {patient_data.get('basicHealthProfile', {}).get('height', {})}
        - Weight: {patient_data.get('basicHealthProfile', {}).get('weight', {})}
        - BMI: {patient_data.get('basicHealthProfile', {}).get('bmi', 'N/A')}
        
        MEDICAL HISTORY:
        - Chronic Diseases: {patient_data.get('medicalHistory', {}).get('chronicDiseases', [])}
        - Previous Surgeries: {patient_data.get('medicalHistory', {}).get('previousSurgeries', [])}
        - Hospitalizations: {patient_data.get('medicalHistory', {}).get('hospitalizations', [])}
        - Family Medical History: {patient_data.get('medicalHistory', {}).get('familyMedicalHistory', [])}
        
        CURRENT HEALTH STATUS:
        - Current Medications: {patient_data.get('currentHealthStatus', {}).get('currentMedications', [])}
        - Allergies: {patient_data.get('currentHealthStatus', {}).get('allergies', [])}
        - Ongoing Treatments: {patient_data.get('currentHealthStatus', {}).get('ongoingTreatments', [])}
        - Smoking Status: {patient_data.get('currentHealthStatus', {}).get('smokingStatus', 'N/A')}
        - Alcohol Consumption: {patient_data.get('currentHealthStatus', {}).get('alcoholConsumption', 'N/A')}
        - Diet Type: {patient_data.get('currentHealthStatus', {}).get('dietType', 'N/A')}
        - Exercise Frequency: {patient_data.get('currentHealthStatus', {}).get('exerciseFrequency', 'N/A')}
        - Sleep Hours: {patient_data.get('currentHealthStatus', {}).get('sleepHours', {})}
        
        PREFERENCES:
        - Language Preference: {patient_data.get('telemedicinePreferences', {}).get('languagePreference', 'English')}
        - Emergency Contacts: {patient_data.get('telemedicinePreferences', {}).get('emergencyContacts', {})}
        """
        
        # 3. Initialize Chat Session
        # We create a new model instance for each request (stateless wrapper) or manage history manually.
        # For simplicity and context injection, we'll prepend context to the history or system prompt.
        
        model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            system_instruction=SYSTEM_INSTRUCTION + "\n" + patient_context
        )
        
        # Convert history format if needed. 
        # Gemini expects [{'role': 'user', 'parts': ['...']}, {'role': 'model', 'parts': ['...']}]
        gemini_history = []
        for msg in history:
            role = "user" if msg['role'] == 'user' else "model"
            gemini_history.append({"role": role, "parts": [msg['content']]})
            
        chat = model.start_chat(history=gemini_history)
        
        # 4. Send Message
        response = chat.send_message(message)
        
        return {
            "response": response.text,
            "success": True
        }

    except Exception as e:
        print(f"Error in chat_with_agent: {e}")
        return {
            "response": "I apologize, but I encountered an error processing your request. Please try again later.",
            "error": str(e)
        }
