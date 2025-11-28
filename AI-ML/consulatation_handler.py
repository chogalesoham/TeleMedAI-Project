import os
from groq import Groq
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import io
import json

# --- Pydantic Models ---
class ConsultationSummary(BaseModel):
    """Summary of medical consultation"""
    doctor_summary: str = Field(description="Detailed summary for doctor with medical terminology")
    patient_summary: str = Field(description="Simple, easy-to-understand summary for patient")
    key_symptoms: List[str] = Field(description="List of key symptoms mentioned")
    diagnosis_discussed: str = Field(description="Diagnosis or conditions discussed")
    medications_prescribed: List[str] = Field(description="Medications prescribed or discussed")
    follow_up_instructions: List[str] = Field(description="Follow-up instructions given")
    important_notes: List[str] = Field(description="Important notes or warnings")

class Medicine(BaseModel):
    """Individual medicine in prescription"""
    name: str = Field(description="Medicine name with strength (e.g., Paracetamol 500mg)")
    generic_name: str = Field(description="Generic name of the medicine")
    dosage: str = Field(description="Dosage per intake (e.g., 1 tablet, 5ml)")
    frequency: dict = Field(description="When to take: {morning: bool, afternoon: bool, night: bool}")
    duration_days: int = Field(description="Number of days to take the medicine")
    instructions: str = Field(description="How to take (e.g., after meals, with water)")
    warnings: str = Field(description="Important warnings or side effects")

class PrescriptionData(BaseModel):
    """Complete prescription data"""
    medicines: List[Medicine] = Field(description="List of prescribed medicines")
    follow_up_date: Optional[str] = Field(description="Follow-up date (YYYY-MM-DD), only if not in consultation")
    additional_instructions: List[str] = Field(description="General prescription instructions")
    contraindications: List[str] = Field(description="Contraindications based on patient history")

async def transcribe_audio(audio_file) -> str:
    """Transcribe audio file using Groq Whisper"""
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        audio_data = await audio_file.read()
        audio_buffer = io.BytesIO(audio_data)
        audio_buffer.name = audio_file.filename

        transcription = client.audio.transcriptions.create(
            file=audio_buffer,
            model="whisper-large-v3-turbo",
            response_format="text",
            language="en"
        )
        return transcription
    except Exception as e:
        print(f"Error during transcription: {e}")
        return None

def generate_consultation_summary(transcription: str) -> ConsultationSummary | None:
    """Generate structured summary from transcription"""
    try:
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        parser = JsonOutputParser(pydantic_object=ConsultationSummary)

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert medical assistant that creates consultation summaries.
            You analyze doctor-patient conversations and create two versions:
            1. Doctor Summary: Detailed, uses medical terminology, comprehensive
            2. Patient Summary: Simple, easy to understand, focuses on action items
            
            Always extract key information accurately and maintain medical accuracy."""),
            ("user", """Analyze this medical consultation transcription and provide a structured summary.

**Consultation Transcription:**
{transcription}

**Instructions:**
1. Create a detailed summary for the doctor with proper medical terminology
2. Create a simple, patient-friendly summary focusing on what they need to know and do
3. Extract all symptoms mentioned
4. Identify diagnosis or conditions discussed
5. List all medications prescribed or discussed
6. Extract follow-up instructions
7. Note any important warnings or special instructions

{format_instructions}""")
        ])

        chain = prompt | llm | parser
        result = chain.invoke({
            "transcription": transcription,
            "format_instructions": parser.get_format_instructions()
        })

        return ConsultationSummary(**result)

    except Exception as e:
        print(f"Error during summarization: {e}")
        return None

def generate_prescription(
    summary: ConsultationSummary, 
    patient_data: Dict[str, Any]
) -> PrescriptionData | None:
    """Generate prescription based on consultation summary and comprehensive patient data"""
    try:
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        parser = JsonOutputParser(pydantic_object=PrescriptionData)

        # Extract patient details
        basic_health = patient_data.get('basicHealthProfile', {})
        medical_history = patient_data.get('medicalHistory', {})
        current_health = patient_data.get('currentHealthStatus', {})
        
        age = calculate_age(basic_health.get('dateOfBirth')) if basic_health.get('dateOfBirth') else "Unknown"
        weight = basic_health.get('weight', {}).get('value', 'Unknown')
        blood_group = basic_health.get('bloodGroup', 'Unknown')
        
        # Compile patient context
        patient_context = f"""
**Patient Age:** {age} years
**Weight:** {weight} kg
**Blood Group:** {blood_group}
**Gender:** {basic_health.get('gender', 'Unknown')}

**Chronic Diseases:** {', '.join([d['name'] for d in medical_history.get('chronicDiseases', [])]) or 'None'}

**Current Medications:** {', '.join([m['name'] + ' (' + m['dosage'] + ')' for m in current_health.get('currentMedications', [])]) or 'None'}

**Allergies:** {', '.join([a['allergen'] + ' (Severity: ' + a['severity'] + ')' for a in current_health.get('allergies', [])]) or 'None'}

**Smoking Status:** {current_health.get('smokingStatus', 'Unknown')}
**Alcohol Consumption:** {current_health.get('alcoholConsumption', 'Unknown')}

**Previous Surgeries:** {', '.join([s['name'] + ' (' + str(s['year']) + ')' for s in medical_history.get('previousSurgeries', [])]) or 'None'}

**Family Medical History:** {', '.join([f['relation'] + ': ' + f['condition'] for f in medical_history.get('familyMedicalHistory', [])]) or 'None'}
"""

        # Check if follow-up already exists
        has_follow_up = len(summary.follow_up_instructions) > 0

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert medical prescription assistant for Indian healthcare.
            Generate appropriate medicine prescriptions considering patient's complete medical history.
            Use Indian medicine names (Paracetamol, Azithromycin, etc.).
            
            CRITICAL: Check for drug interactions, contraindications, and allergies.
            Adjust dosages based on age, weight, and existing conditions.
            Follow Indian medical prescription standards."""),
            ("user", """Generate a prescription based on the following consultation and patient history:

{patient_context}

**Current Consultation:**
**Diagnosis:** {diagnosis}
**Symptoms:** {symptoms}
**Medications Mentioned in Consultation:** {medications_mentioned}

**Instructions:**
1. Suggest appropriate medicines with Indian brand/generic names
2. CHECK FOR DRUG INTERACTIONS with current medications
3. AVOID medicines if patient has allergies to them
4. Adjust dosage based on age, weight, and chronic conditions
5. Specify dosage per intake (tablets, ml, etc.)
6. Set frequency as: {{"morning": true/false, "afternoon": true/false, "night": true/false}}
7. Determine duration in days
8. Add clear instructions (after meals, with water, etc.)
9. Include warnings specific to patient's health conditions
10. Add contraindications based on patient history
11. Add general prescription instructions
12. Calculate follow-up date ONLY if: {should_add_follow_up}
    - If yes: Set follow_up_date as completion of longest medicine duration
    - If no: Set follow_up_date to null

**CRITICAL SAFETY CHECKS:**
- List any contraindications based on chronic diseases
- Flag any potential drug interactions
- Note any dosage adjustments made due to age/weight
- Warn about medicines to avoid due to allergies

{format_instructions}""")
        ])

        chain = prompt | llm | parser
        result = chain.invoke({
            "patient_context": patient_context,
            "diagnosis": summary.diagnosis_discussed,
            "symptoms": ", ".join(summary.key_symptoms),
            "medications_mentioned": ", ".join(summary.medications_prescribed) if summary.medications_prescribed else "None",
            "should_add_follow_up": "NO - follow-up already exists in consultation" if has_follow_up else "YES - calculate follow-up date",
            "format_instructions": parser.get_format_instructions()
        })

        return PrescriptionData(**result)

    except Exception as e:
        print(f"Error during prescription generation: {e}")
        return None

def calculate_age(date_of_birth: str) -> int:
    """Calculate age from date of birth"""
    try:
        if isinstance(date_of_birth, str):
            dob = datetime.fromisoformat(date_of_birth.replace('Z', '+00:00'))
        else:
            dob = date_of_birth
        today = datetime.now()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return age
    except:
        return 0

async def process_consultation(audio_file, patient_data: Dict[str, Any]) -> dict:
    """Main function to process consultation audio and generate prescription"""
    
    # Step 1: Transcribe audio
    transcription = await transcribe_audio(audio_file)
    if not transcription or len(transcription.strip()) < 10:
        return {"error": "Failed to transcribe audio or audio is too short"}
    
    # Step 2: Generate consultation summary
    summary = generate_consultation_summary(transcription)
    if not summary:
        return {"error": "Failed to generate consultation summary"}
    
    # Step 3: Generate prescription with patient history
    prescription = generate_prescription(summary, patient_data)
    if not prescription:
        return {"error": "Failed to generate prescription"}
    
    return {
        "success": True,
        "transcription": transcription,
        "summary": summary.dict(),
        "prescription": prescription.dict()
    }