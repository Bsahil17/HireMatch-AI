import io
import re
from typing import List, Optional
from PyPDF2 import PdfReader

from ..schemas.resume_schema import (
    ParsedResumeResponse,
    ProjectItem,
    EducationItem,
    ExperienceItem
)
from ..utils.text_cleaner import (
    clean_text,
    extract_email,
    extract_phone,
    extract_candidate_name
)
from .skill_extractor import extract_skills_from_text, categorize_skills
from .experience_extractor import extract_years_of_experience, extract_work_experience_items
from .education_extractor import extract_education_items

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extracts text from PDF bytes using PyPDF2."""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text_parts = []
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text_parts.append(extracted)
        return "\n".join(text_parts)
    except Exception as e:
        # Graceful fallback or error logging
        return ""

def extract_text_from_docx_bytes(docx_bytes: bytes) -> str:
    """Extracts text from DOCX bytes using python-docx."""
    try:
        import docx
        doc = docx.Document(io.BytesIO(docx_bytes))
        text_parts = [para.text for para in doc.paragraphs if para.text]
        return "\n".join(text_parts)
    except Exception:
        # Fallback regex extraction if docx library has issues
        try:
            raw_str = docx_bytes.decode('utf-8', errors='ignore')
            clean = re.sub(r'<[^>]+>', ' ', raw_str)
            return clean
        except Exception:
            return ""

def extract_projects(text: str, skills: List[str]) -> List[ProjectItem]:
    """Extracts candidate projects mentioned in the resume."""
    projects: List[ProjectItem] = []
    lines = text.split('\n')
    
    project_section_active = False
    current_title = None
    
    for line in lines:
        clean = line.strip()
        lower = clean.lower()
        
        if any(h in lower for h in ['projects', 'academic projects', 'personal projects', 'key projects']):
            project_section_active = True
            continue
        elif any(h in lower for h in ['education', 'experience', 'skills', 'certifications', 'hobbies']):
            project_section_active = False
            
        if project_section_active and clean:
            # Bullet point or title
            if clean.startswith(('•', '-', '*', '1.', '2.', '3.')):
                if not current_title:
                    current_title = clean.lstrip('•-* 0123456789.').strip()
                else:
                    techs = [s for s in skills if s.lower() in clean.lower()]
                    projects.append(ProjectItem(
                        title=current_title[:60],
                        description=clean[:200],
                        technologies=techs
                    ))
                    current_title = None
            elif len(clean) < 70 and not current_title:
                current_title = clean

        if len(projects) >= 4:
            break
            
    return projects

def extract_certifications(text: str) -> List[str]:
    """Extracts industry certifications (AWS Certified, CKA, Oracle, etc.)."""
    certs = []
    cert_patterns = [
        r'aws certified [a-zA-Z\s]+',
        r'certified kubernetes [a-zA-Z\s]+',
        r'oracle certified [a-zA-Z\s]+',
        r'microsoft certified [a-zA-Z\s]+',
        r'google cloud certified [a-zA-Z\s]+',
        r'scrum master certified',
        r'cisco certified [a-zA-Z\s]+'
    ]
    lower = text.lower()
    for pat in cert_patterns:
        matches = re.findall(pat, lower)
        for m in matches:
            certs.append(m.title())
    return list(set(certs))

def parse_resume(raw_text: str, filename: Optional[str] = None) -> ParsedResumeResponse:
    """
    Main pipeline to parse raw or extracted text into a structured resume model.
    """
    cleaned = clean_text(raw_text)
    
    # 1. Contact Info
    email = extract_email(cleaned)
    phone = extract_phone(cleaned)
    candidate_name = extract_candidate_name(cleaned, fallback_email=email)
    
    # 2. Skills
    skills = extract_skills_from_text(cleaned)
    categorized = categorize_skills(skills)
    
    # 3. Experience & Education
    years_exp = extract_years_of_experience(cleaned)
    work_exp_items = extract_work_experience_items(cleaned)
    education_items = extract_education_items(cleaned)
    
    # 4. Projects & Certs
    projects = extract_projects(cleaned, skills)
    certs = extract_certifications(cleaned)
    
    # 5. Summary preview
    preview = cleaned[:500] + "..." if len(cleaned) > 500 else cleaned
    summary = f"Candidate with {years_exp} years estimated experience in {', '.join(skills[:5]) if skills else 'Software Engineering'}."
    
    return ParsedResumeResponse(
        candidate_name=candidate_name,
        email=email,
        phone=phone,
        technical_skills=skills,
        categorized_skills=categorized,
        estimated_experience_years=years_exp,
        education=education_items,
        work_experience=work_exp_items,
        projects=projects,
        certifications=certs,
        extracted_text_preview=preview,
        summary=summary
    )
