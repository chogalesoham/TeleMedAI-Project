import os
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List
import PyPDF2
from PIL import Image
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

#  Pydantic Models 
class ReportFinding(BaseModel):
    """Individual finding from the medical report"""
    parameter: str = Field(description="Name of the test parameter (e.g., Hemoglobin, Glucose)")
    value: str = Field(description="Measured value")
    normal_range: str = Field(description="Normal reference range")
    status: str = Field(description="Status: Normal, High, Low, or Critical")

class ReportAnalysis(BaseModel):
    """Complete analysis of medical report"""
    report_type: str = Field(description="Type of report (e.g., Blood Test, Lipid Profile)")
    findings: List[ReportFinding] = Field(description="List of all test findings")
    summary: str = Field(description="Overall summary of the report")
    recommendations: List[str] = Field(description="Health recommendations based on findings")
    concerns: List[str] = Field(description="Areas that need attention")
    disclaimer: str = Field(
        default="This is an AI-generated analysis. Please consult with a healthcare professional for medical advice."
    )

def extract_text_from_pdf(pdf_file) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
            print(f"Extracted PDF text length: {len(text)}")  # ADD THIS
            print(f"First 200 chars: {text[:200]}")  # ADD THIS
        return text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return None

def extract_text_from_image(image_file) -> str:
    """Extract text from image using OCR"""
    try:
        image = Image.open(image_file)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"Error extracting image text: {e}")
        return None

def analyze_medical_report(report_text: str) -> ReportAnalysis | None:
    """
    Analyzes medical report text using LangChain and provides structured analysis
    """
    
    try:
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        
        parser = JsonOutputParser(pydantic_object=ReportAnalysis)
        

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert medical AI assistant analyzing medical reports. 
            You provide accurate, structured analysis in JSON format.
            Always use simple, patient-friendly language and include appropriate medical disclaimers."""),
            ("human", """Analyze the following medical report and provide a structured analysis.

**Medical Report:**
{report_text}

**Instructions:**
1. Identify the type of report (blood test, lipid profile, liver function, etc.)
2. Extract all test parameters with their values and normal ranges
3. Classify each parameter as Normal, High, Low, or Critical
4. Provide an overall summary of the report
5. Give practical health recommendations based on the findings
6. Highlight any concerns that need immediate attention

**Important:** 
- Be accurate with medical values
- Use simple, patient-friendly language
- Always include a disclaimer about consulting healthcare professionals
- If values are concerning, clearly state they need medical attention

{format_instructions}
""")
        ])
        
        chain = prompt | llm | parser
        
        result = chain.invoke({
            "report_text": report_text,
            "format_instructions": parser.get_format_instructions()
        })
        
        validated_analysis = ReportAnalysis(**result)
        
        return validated_analysis
        
    except Exception as e:
        print(f"Error during report analysis: {e}")
        return None

async def process_report_file(file, file_type: str) -> dict:
    """
    Main function to process uploaded report file
    """
    if file_type == 'pdf':
        text = extract_text_from_pdf(file.file)
    elif file_type in ['jpg', 'jpeg', 'png']:
        text = extract_text_from_image(file.file)
    else:
        return {"error": "Unsupported file type"}
    
    analysis = analyze_medical_report(text)
    
    return {
        "success": True,
        "analysis": analysis.dict()
    }