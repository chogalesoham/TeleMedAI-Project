import os
from groq import Groq
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List
import io

# Pydantic Models 
class PossibleCondition(BaseModel):
    """Possible medical condition"""
    condition: str = Field(description="Name of the condition")
    probability: str = Field(description="Probability: High, Moderate, Low")
    description: str = Field(description="Brief description of the condition")

class PreDiagnosisResult(BaseModel):
    """Pre-diagnosis analysis result"""
    symptoms_identified: List[str] = Field(description="List of symptoms identified")
    possible_conditions: List[PossibleCondition] = Field(description="List of possible conditions")
    severity: str = Field(description="Severity assessment: Mild, Moderate, Severe, Critical")
    recommendations: List[str] = Field(description="General health recommendations")
    when_to_see_doctor: str = Field(description="When immediate medical attention is needed")
    disclaimer: str = Field(
        default="This is an AI-generated pre-diagnosis. Always consult a healthcare professional for accurate diagnosis and treatment."
    )

async def transcribe_audio_symptoms(audio_file) -> str:
    """Transcribe audio symptoms using Groq Whisper"""
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

def analyze_symptoms(symptoms_text: str) -> PreDiagnosisResult | None:
    """Analyze symptoms and provide pre-diagnosis"""
    try:
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        
        parser = JsonOutputParser(pydantic_object=PreDiagnosisResult)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert medical AI assistant for pre-diagnosis.
            You analyze symptoms and provide possible conditions with appropriate medical advice.
            Always prioritize patient safety and recommend professional consultation when needed."""),
            ("user", """Analyze the following symptoms and provide a pre-diagnosis.

**Symptoms:**
{symptoms}

**Instructions:**
1. Identify all symptoms mentioned
2. List possible medical conditions (most to least likely)
3. Assess severity level
4. Provide general health recommendations
5. Clearly state when to seek immediate medical attention
6. Include appropriate medical disclaimer

{format_instructions}""")
        ])
        
        chain = prompt | llm | parser
        
        result = chain.invoke({
            "symptoms": symptoms_text,
            "format_instructions": parser.get_format_instructions()
        })
        
        return PreDiagnosisResult(**result)
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        return None

async def process_pre_diagnosis(symptoms_text: str = None, audio_file=None) -> dict:
    """Main function to process pre-diagnosis"""
    
    if audio_file:
        symptoms_text = await transcribe_audio_symptoms(audio_file)
        if not symptoms_text:
            return {"error": "Failed to transcribe audio"}
    
    if not symptoms_text or len(symptoms_text.strip()) < 5:
        return {"error": "No symptoms provided or text too short"}
    
    diagnosis = analyze_symptoms(symptoms_text)
    
    if not diagnosis:
        return {"error": "Failed to analyze symptoms"}
    
    return {
        "success": True,
        "symptoms_input": symptoms_text,
        "diagnosis": diagnosis.dict()
    }