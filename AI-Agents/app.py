import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from report_analyzer import process_report_file
from consulatation_handler import process_consultation
from agent_service import chat_with_agent
from typing import Dict, Optional, List, Any
from pydantic import BaseModel
import uvicorn
from datetime import datetime

load_dotenv()

app = FastAPI(
    title="Telemedicine AI API",
    description="AI-powered medical services with prescription generation",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 25 * 1024 * 1024  
ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'ogg', 'webm', 'm4a', 'flac'}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_extension(filename: str) -> str:
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Telemedicine AI API",
        "status": "healthy",
        "version": "2.0.0",
        "endpoints": {
            "report_analysis": "/ai/report-analyze",
            "consultation_processing": "/api/v1/consultation/process",
            "pre_diagnosis": "/api/v1/pre-diagnosis",
            "agent_chat": "/api/v1/agent/chat",
            "chat_diagnosis": "/initial-problem, /next-question, /final-summary",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "Telemedicine AI"}

@app.post("/ai/report-analyze", tags=["AI Analysis"])
async def ai_report_analyze(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    notes: Optional[str] = Form(None)
) -> Dict:
    """Analyze medical report (PDF or image)"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    contents = await file.read()
    file_size = len(contents)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large (max 25MB)")
    await file.seek(0)

    try:
        file_type = get_file_extension(file.filename)
        uploaded_at = datetime.utcnow().isoformat()

        result = await process_report_file(file, file_type)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])

        report_meta = {
            "fileName": file.filename,
            "fileType": file_type,
            "fileSize": file_size,
            "documentType": document_type,
            "notes": notes,
            "uploadedAt": uploaded_at
        }

        response = {
            "success": True,
            "message": "Report analyzed successfully.",
            "reportMeta": report_meta,
            "analysis": result["analysis"]
        }
        return JSONResponse(content=response, status_code=200)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/api/v1/consultation/process", tags=["Consultation"])
async def process_consultation_endpoint(
    file: UploadFile = File(...),
    patient_data: str = Form(...)  # JSON string of patient data
) -> Dict:
    """
    Process consultation audio and generate prescription
    
    - **file**: Audio file (MP3, WAV, etc.)
    - **patient_data**: JSON string containing patient's complete health data
    
    Expected patient_data format:
    {
        "basicHealthProfile": {...},
        "medicalHistory": {...},
        "currentHealthStatus": {...}
    }
    
    Returns: Transcription, consultation summary, and generated prescription
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")
    
    file_ext = get_file_extension(file.filename)
    if file_ext not in ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid audio format. Allowed: {', '.join(ALLOWED_AUDIO_EXTENSIONS)}"
        )
    
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 25MB)")
    
    await file.seek(0)
    
    # Parse patient data
    try:
        import json
        patient_info = json.loads(patient_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid patient_data JSON format")
    
    try:
        result = await process_consultation(file, patient_info)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return JSONResponse(content=result, status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
    
@app.post("/api/v1/pre-diagnosis", tags=["Pre-Diagnosis"])
async def pre_diagnosis_endpoint(
    symptoms: Optional[str] = Form(None),
    audio: Optional[UploadFile] = File(None)
) -> Dict:
    """Pre-diagnosis based on symptoms (text or audio)"""
    if not symptoms and not audio:
        raise HTTPException(
            status_code=400,
            detail="Either symptoms text or audio file must be provided"
        )
    
    if audio and audio.filename:
        file_ext = get_file_extension(audio.filename)
        if file_ext not in ALLOWED_AUDIO_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid audio format. Allowed: {', '.join(ALLOWED_AUDIO_EXTENSIONS)}"
            )
        
        contents = await audio.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large (max 25MB)")
        
        await audio.seek(0)
    
    try:
        from pre_diagnosis import process_pre_diagnosis
        result = await process_pre_diagnosis(symptoms_text=symptoms, audio_file=audio)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return JSONResponse(content=result, status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

class ChatRequest(BaseModel):
    userId: str
    message: str
    history: List[Dict[str, str]] = []

@app.post("/api/v1/agent/chat", tags=["Agent"])
async def agent_chat_endpoint(request: ChatRequest):
    """Chat with Agentic AI Health Assistant"""
    if not request.userId:
        raise HTTPException(status_code=400, detail="userId is required")
        
    result = await chat_with_agent(request.userId, request.message, request.history)
    
    if "error" in result:
        if result["error"] == "Patient data not found":
            raise HTTPException(status_code=404, detail=result["response"])
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result

from chat_diagnosis import (
    analyze_initial_problem,
    generate_next_question,
    extract_entities_from_text,
    generate_final_summary
)

class InitialProblemRequest(BaseModel):
    problem_text: str

class NextQuestionRequest(BaseModel):
    history: List[Dict[str, Any]]
    patient_info: Dict[str, Any]

class ExtractEntitiesRequest(BaseModel):
    text: str

class FinalSummaryRequest(BaseModel):
    history: List[Dict[str, Any]]
    patient_info: Dict[str, Any]

@app.post("/initial-problem", tags=["Chat Diagnosis"])
async def initial_problem_endpoint(request: InitialProblemRequest):
    result = await analyze_initial_problem(request.problem_text)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/next-question", tags=["Chat Diagnosis"])
async def next_question_endpoint(request: NextQuestionRequest):
    result = await generate_next_question(request.history, request.patient_info)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/extract-entities", tags=["Chat Diagnosis"])
async def extract_entities_endpoint(request: ExtractEntitiesRequest):
    result = await extract_entities_from_text(request.text)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/final-summary", tags=["Chat Diagnosis"])
async def final_summary_endpoint(request: FinalSummaryRequest):
    result = await generate_final_summary(request.history, request.patient_info)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(status_code=404, content={"error": "Endpoint not found"})

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(status_code=500, content={"error": "Internal server error"})

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)