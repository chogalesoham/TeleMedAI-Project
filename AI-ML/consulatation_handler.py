import os
from groq import Groq
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List
import io

# Pydantic Models 
class ConsultationSummary(BaseModel):
    """Summary of medical consultation"""
    doctor_summary: str = Field(description="Detailed summary for doctor with medical terminology")
    patient_summary: str = Field(description="Simple, easy-to-understand summary for patient")
    key_symptoms: List[str] = Field(description="List of key symptoms mentioned")
    diagnosis_discussed: str = Field(description="Diagnosis or conditions discussed")
    medications_prescribed: List[str] = Field(description="Medications prescribed or discussed")
    follow_up_instructions: List[str] = Field(description="Follow-up instructions given")
    important_notes: List[str] = Field(description="Important notes or warnings")

async def transcribe_audio(audio_file) -> str:
    """Transcribe audio file using Groq Whisper """
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY_CONSULATION"))
        audio_data = await audio_file.read()
        audio_buffer = io.BytesIO(audio_data)
        audio_buffer.name = audio_file.filename

        transcription = client.audio.transcriptions.create(
            file=audio_buffer,
            model="Whisper-large-v3-turbo",
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
            model = "llama-3.3-70b-versatile",
            temperature=0.3,
            groq_api_key = os.getenv("GROQ_API_KEY_CONSULATION")
        )
        parser = JsonOutputParser(pydantic_object=ConsultationSummary)

        prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert medical assistant that creates consultation summaries.
            You analyze doctor-patient conversations and create two versions:
            1. Doctor Summary: Detailed, uses medical terminology, comprehensive
            2. Patient Summary: Simple, easy to understand, focuses on action items
            
            Always extract key information accurately and maintain medical accuracy."""),
        ("user","""Analyze this medical consultation transcription and provide a structured summary.

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

            **CRITICAL INSTRUCTION: Your entire response MUST be a single JSON object that strictly adheres to the provided schema.** Do not include any introductory text, markdown formatting (like ```json), or explanatory notes outside the JSON structure.
            
            {format_instructions} """)
    ])

        chain = prompt | llm | parser

        result = chain.invoke({
        "transcription" : transcription,
        "format_instructions" : parser.get_format_instructions()
    })

        validated_summary = ConsultationSummary(**result)
        return validated_summary

    except Exception as e:
        print(f"Error during summarization : {e}")
        return None

async def process_consultation(audio_file) -> dict:
    """Main function to process consulatation audio """
    transcription = await transcribe_audio(audio_file)

    summary = generate_consultation_summary(transcription)

    # Check 2: Summarization Failure (Crucial)
    if summary is None:
        return {
            "success": False, 
            "transcription": transcription, 
            "error": "Summary generation failed. Check LLM logs for JSON parsing errors."
        }

    return {
        "sucess" : True,
        "transcription" : transcription,
        "summary" : summary.dict()
    }
