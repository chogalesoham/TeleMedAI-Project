import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from report_analyzer import process_report_file
from consulatation_handler import process_consultation
from pre_diagnosis import process_pre_diagnosis
from typing import Dict, Optional
import uvicorn

load_dotenv()

app = FastAPI(
    title="Telemedicine AI API",
    description="AI-powered medical services: Report Analysis & Consultation Processing",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 16 * 1024 * 1024  
ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'ogg', 'webm', 'm4a', 'flac'}

def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_extension(filename: str) -> str:
    """Get file extension"""
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

# --- Health Check Endpoint ---
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Telemedicine Report Analyzer API",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": {
            "report_analysis": "/api/v1/reports/analyze",
            "consultation_processing": "/api/v1/consultation/process",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Telemedicine Report Analyzer"
    }

from datetime import datetime

# --- New AI Report Analyze Endpoint ---
@app.post("/ai/report-analyze", tags=["AI Analysis"])
async def ai_report_analyze(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    notes: Optional[str] = Form(None)
) -> Dict:
    """
    Analyze medical report (PDF or image) using Groq Llama 3.3
    Accepts multipart/form-data: file, document_type, notes
    Returns structured JSON: { success, message, reportMeta, analysis }
    """
    # Validate filename
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    # Validate file type
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Check file size
    contents = await file.read()
    file_size = len(contents)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024)}MB"
        )
    await file.seek(0)

    try:
        file_type = get_file_extension(file.filename)
        uploaded_at = datetime.utcnow().isoformat()

        # Process the report (extract text + AI analysis)
        result = await process_report_file(file, file_type)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])

        # Compose reportMeta
        report_meta = {
            "fileName": file.filename,
            "fileType": file_type,
            "fileSize": file_size,
            "documentType": document_type,
            "notes": notes,
            "uploadedAt": uploaded_at
        }

        # Compose response
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
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )

# --- NEW: Consultation Processing Endpoint ---
@app.post("/api/v1/consultation/process", tags=["Consultation"])
async def process_consultation_endpoint(file: UploadFile = File(...)) -> Dict:
    """
    Process consultation audio recording
    
    - **file**: Audio file (MP3, WAV, OGG, WEBM, M4A, FLAC)
    
    Returns:
    - Full transcription
    - Doctor summary (detailed, medical terminology)
    - Patient summary (simple, actionable)
    - Key symptoms, diagnosis, medications, follow-up instructions
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
    
    try:
        result = await process_consultation(file)
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
    """
    Pre-diagnosis based on symptoms (text or audio)
    
    - **symptoms**: Text description of symptoms (optional if audio provided)
    - **audio**: Audio file with symptoms description (optional if text provided)
    
    Returns possible conditions, severity, and recommendations
    """
    
    # Validate input
    if not symptoms and not audio:
        raise HTTPException(
            status_code=400,
            detail="Either symptoms text or audio file must be provided"
        )
    
    # Validate audio if provided
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
        result = await process_pre_diagnosis(symptoms_text=symptoms, audio_file=audio)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return JSONResponse(content=result, status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


# --- Error Handlers ---
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
