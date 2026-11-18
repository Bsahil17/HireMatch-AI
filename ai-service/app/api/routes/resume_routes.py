from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional, List
from ...schemas.resume_schema import ParsedResumeResponse, SkillCategoryBreakdown
from ...services.resume_parser import (
    parse_resume,
    extract_text_from_pdf_bytes,
    extract_text_from_docx_bytes
)
from ...services.skill_extractor import extract_skills_from_text, categorize_skills
from ...utils.skill_normalizer import normalize_skill

router = APIRouter(tags=["Resume Processing"])

@router.post("/parse-resume", response_model=ParsedResumeResponse)
async def api_parse_resume(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """
    Parses a resume from either uploaded file (PDF/DOCX) or supplied text.
    Extracts contact info, technical skills, education, experience, and projects.
    """
    extracted_text = ""
    filename = None
    
    if file:
        filename = file.filename
        content = await file.read()
        lower_name = (file.filename or "").lower()
        
        if lower_name.endswith(".pdf"):
            extracted_text = extract_text_from_pdf_bytes(content)
        elif lower_name.endswith(".docx") or lower_name.endswith(".doc"):
            extracted_text = extract_text_from_docx_bytes(content)
        else:
            # Try decoding as plain text
            try:
                extracted_text = content.decode("utf-8")
            except UnicodeDecodeError:
                raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or DOCX.")
    elif text:
        extracted_text = text
    else:
        raise HTTPException(status_code=400, detail="Either 'text' or 'file' must be provided.")
        
    if not extracted_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract readable text from resume.")
        
    return parse_resume(extracted_text, filename=filename)

@router.post("/extract-skills")
async def api_extract_skills(payload: dict):
    """Extracts and categorizes skills from provided text."""
    text = payload.get("text", "")
    skills = extract_skills_from_text(text)
    categorized = categorize_skills(skills)
    return {
        "skills": skills,
        "count": len(skills),
        "categorized": categorized
    }
