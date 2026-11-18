from pydantic import BaseModel, Field
from typing import List, Optional

class ResumeParseRequest(BaseModel):
    text: Optional[str] = None
    filename: Optional[str] = None

class SkillCategoryBreakdown(BaseModel):
    programming_languages: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    cloud_devops: List[str] = Field(default_factory=list)
    tools_other: List[str] = Field(default_factory=list)

class EducationItem(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[int] = None
    gpa: Optional[str] = None

class ExperienceItem(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    duration_months: Optional[int] = None
    description: Optional[str] = None

class ProjectItem(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)

class ParsedResumeResponse(BaseModel):
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    technical_skills: List[str] = Field(default_factory=list)
    categorized_skills: SkillCategoryBreakdown = Field(default_factory=SkillCategoryBreakdown)
    estimated_experience_years: float = 0.0
    education: List[EducationItem] = Field(default_factory=list)
    work_experience: List[ExperienceItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    extracted_text_preview: str = ""
    summary: Optional[str] = None
