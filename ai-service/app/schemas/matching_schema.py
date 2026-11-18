from pydantic import BaseModel, Field
from typing import List, Optional
from .resume_schema import ParsedResumeResponse

class JobRequirement(BaseModel):
    job_id: Optional[int] = None
    title: str
    department: Optional[str] = None
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    min_experience_years: float = 0.0
    max_experience_years: Optional[float] = None
    required_education: Optional[str] = None
    job_description: Optional[str] = None

class CandidateApplicationMatchRequest(BaseModel):
    application_id: Optional[int] = None
    candidate_id: Optional[int] = None
    candidate_name: Optional[str] = None
    resume_text: Optional[str] = None
    parsed_resume: Optional[ParsedResumeResponse] = None
    job: JobRequirement

class MatchAnalysisResponse(BaseModel):
    application_id: Optional[int] = None
    candidate_name: Optional[str] = None
    overall_match_score: int
    recommendation: str # Strong Match, Good Match, Moderate Match, Low Match
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    preferred_skills_matched: List[str] = Field(default_factory=list)
    missing_preferred_skills: List[str] = Field(default_factory=list)
    
    # Granular component scores (0 - 100)
    required_skills_score: float = 0.0
    preferred_skills_score: float = 0.0
    experience_score: float = 0.0
    education_score: float = 0.0
    project_score: float = 0.0
    
    experience_match: bool = False
    education_match: bool = False
    candidate_experience_years: float = 0.0
    
    candidate_strengths: List[str] = Field(default_factory=list)
    candidate_gaps: List[str] = Field(default_factory=list)
    explanation: str
    semantic_summary: Optional[str] = None

class BatchMatchRequest(BaseModel):
    job: JobRequirement
    applications: List[CandidateApplicationMatchRequest]

class BatchMatchResponse(BaseModel):
    job_id: Optional[int] = None
    total_applications: int
    ranked_candidates: List[MatchAnalysisResponse]
