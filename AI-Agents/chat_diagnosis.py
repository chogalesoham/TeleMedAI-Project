import os
from groq import Groq
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional

# --- Pydantic Models ---

class InitialAnalysis(BaseModel):
    """Analysis of the initial problem statement"""
    symptoms_identified: List[str] = Field(description="List of symptoms identified from the initial statement")
    potential_conditions: List[str] = Field(description="List of potential conditions based on initial symptoms")
    severity_assessment: str = Field(description="Initial severity assessment: Mild, Moderate, Severe")
    triage_advice: str = Field(description="Immediate advice if symptoms seem critical")

class NextQuestion(BaseModel):
    """Next question to ask the patient"""
    question: str = Field(description="The next question to ask the patient")
    options: List[str] = Field(description="List of 4 suggested short answer options for the patient")
    rationale: str = Field(description="Why this question is being asked")
    is_final: bool = Field(description="Whether enough information has been gathered to form a diagnosis")

class MedicalEntity(BaseModel):
    """Extracted medical entity"""
    entity: str = Field(description="The extracted entity (e.g., 'headache', 'ibuprofen')")
    category: str = Field(description="Category: Symptom, Medication, Condition, Allergy, etc.")
    confidence: float = Field(description="Confidence score between 0 and 1")

class ExtractedEntities(BaseModel):
    """List of extracted entities"""
    entities: List[MedicalEntity] = Field(description="List of medical entities found in the text")

class FinalSummary(BaseModel):
    """Final diagnosis summary"""
    possible_conditions: List[dict] = Field(description="List of possible conditions with probability and description")
    recommendations: List[str] = Field(description="List of health recommendations")
    summary_text: str = Field(description="A comprehensive summary of the consultation")
    specialist_recommendation: str = Field(description="Recommended specialist to see")

# --- Logic ---

def get_llm():
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.3,
        groq_api_key=os.getenv("GROQ_API_KEY")
    )

async def analyze_initial_problem(problem_text: str) -> dict:
    try:
        llm = get_llm()
        parser = JsonOutputParser(pydantic_object=InitialAnalysis)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert medical AI assistant. Analyze the patient's initial symptom description.
            Identify symptoms, potential conditions, and assess severity.
            If the situation appears life-threatening, provide immediate triage advice.
            
            {format_instructions}"""),
            ("user", "{problem_text}")
        ])
        
        chain = prompt | llm | parser
        result = chain.invoke({
            "problem_text": problem_text,
            "format_instructions": parser.get_format_instructions()
        })
        return result
    except Exception as e:
        print(f"Error in analyze_initial_problem: {e}")
        return {"error": str(e)}

async def generate_next_question(history: List[dict], patient_info: dict) -> dict:
    try:
        llm = get_llm()
        parser = JsonOutputParser(pydantic_object=NextQuestion)
        
        # Format history for context
        conversation_context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
        patient_context = str(patient_info)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a medical AI conducting a diagnostic interview.
            Your goal is to ask relevant follow-up questions to narrow down the diagnosis.
            Review the conversation history and patient info.
            Ask ONE clear, concise question at a time.
            Do not repeat questions.
            Provide 4 simple, likely answer options for the patient to choose from (e.g., "Yes", "No", "2 days", "Sharp pain").
            If you have enough information (usually after 6 questions) or if the condition is clear, set is_final to true.
            
            Patient Info: {patient_context}
            
            {format_instructions}"""),
            ("user", """Conversation History:
            {conversation_context}
            
            Generate the next question with options.""")
        ])
        
        chain = prompt | llm | parser
        result = chain.invoke({
            "conversation_context": conversation_context,
            "patient_context": patient_context,
            "format_instructions": parser.get_format_instructions()
        })
        return result
    except Exception as e:
        print(f"Error in generate_next_question: {e}")
        return {"error": str(e)}

async def extract_entities_from_text(text: str) -> dict:
    try:
        llm = get_llm()
        parser = JsonOutputParser(pydantic_object=ExtractedEntities)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """Extract medical entities from the text.
            Categorize them into: Symptom, Medication, Condition, Allergy, Body Part, Duration, Severity.
            
            {format_instructions}"""),
            ("user", "{text}")
        ])
        
        chain = prompt | llm | parser
        result = chain.invoke({
            "text": text,
            "format_instructions": parser.get_format_instructions()
        })
        return result
    except Exception as e:
        print(f"Error in extract_entities_from_text: {e}")
        return {"error": str(e)}

async def generate_final_summary(history: List[dict], patient_info: dict) -> dict:
    try:
        llm = get_llm()
        parser = JsonOutputParser(pydantic_object=FinalSummary)
        
        conversation_context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
        patient_context = str(patient_info)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert medical AI. Provide a final diagnosis summary based on the consultation.
            List possible conditions with probabilities.
            Provide actionable recommendations.
            Suggest the appropriate specialist.
            Always include a disclaimer that this is AI-generated and not a replacement for professional medical advice.
            
            Patient Info: {patient_context}
            
            {format_instructions}"""),
            ("user", """Conversation History:
            {conversation_context}
            
            Generate the final summary.""")
        ])
        
        chain = prompt | llm | parser
        result = chain.invoke({
            "conversation_context": conversation_context,
            "patient_context": patient_context,
            "format_instructions": parser.get_format_instructions()
        })
        return result
    except Exception as e:
        print(f"Error in generate_final_summary: {e}")
        return {"error": str(e)}
