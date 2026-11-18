import logging
from typing import Optional
from ..config import settings
from ..schemas.matching_schema import MatchAnalysisResponse, JobRequirement
from ..schemas.resume_schema import ParsedResumeResponse

logger = logging.getLogger(__name__)

def enhance_with_llm(
    match_result: MatchAnalysisResponse,
    parsed_resume: ParsedResumeResponse,
    job: JobRequirement
) -> MatchAnalysisResponse:
    """
    Optional LLM enrichment step for qualitative context and interview questions.
    Falls back gracefully to local deterministic reasoning if LLM is unconfigured or unavailable.
    """
    provider = settings.LLM_PROVIDER.upper()
    
    # 1. Try Gemini if configured
    if provider == "GEMINI" and settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel(settings.LLM_MODEL_NAME or "gemini-1.5-flash")
            
            prompt = f"""
            Act as an expert technical recruiter analyzing a candidate for:
            Job: {job.title} ({job.department})
            Required Skills: {', '.join(job.required_skills)}
            Candidate: {parsed_resume.candidate_name}
            Matched Skills: {', '.join(match_result.matched_skills)}
            Missing Skills: {', '.join(match_result.missing_skills)}
            Experience: {match_result.candidate_experience_years} years
            Deterministic Match Score: {match_result.overall_match_score}%

            Provide a 2-3 sentence executive summary of the candidate's suitability and 2 targeted technical interview questions to probe their competence in missing or key areas.
            """
            response = model.generate_content(prompt)
            if response and response.text:
                match_result.semantic_summary = response.text.strip()
                return match_result
        except Exception as e:
            logger.warning(f"Gemini LLM enrichment failed: {e}. Falling back to local summary.")

    # 2. Try OpenAI if configured
    elif provider == "OPENAI" and settings.OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY, timeout=settings.LLM_TIMEOUT_SECONDS)
            
            response = client.chat.completions.create(
                model=settings.LLM_MODEL_NAME or "gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a senior technical hiring manager. Return concise recruitment insights."},
                    {"role": "user", "content": f"Candidate: {parsed_resume.candidate_name}, Job: {job.title}, Matched: {match_result.matched_skills}, Missing: {match_result.missing_skills}, Score: {match_result.overall_match_score}%. Provide brief executive summary and 2 interview questions."}
                ],
                max_tokens=250
            )
            content = response.choices[0].message.content
            if content:
                match_result.semantic_summary = content.strip()
                return match_result
        except Exception as e:
            logger.warning(f"OpenAI LLM enrichment failed: {e}. Falling back to local summary.")

    # 3. Deterministic Local Executive Summary Fallback
    local_summary_lines = [
        f"Executive Summary for {parsed_resume.candidate_name}:",
        f"Candidate presents a {match_result.recommendation.lower()} for the {job.title} position with an aggregate score of {match_result.overall_match_score}%.",
    ]
    if match_result.matched_skills:
        local_summary_lines.append(f"Demonstrates strong technical capabilities in {', '.join(match_result.matched_skills[:4])}.")
    if match_result.missing_skills:
        local_summary_lines.append(f"Key areas for recruiter review or interview probing: {', '.join(match_result.missing_skills)}.")
    else:
        local_summary_lines.append("Complete coverage of mandatory technical competencies.")
        
    local_summary_lines.append("Suggested Interview Focus: Verify depth in production-scale scenarios and architectural trade-offs.")

    match_result.semantic_summary = " ".join(local_summary_lines)
    return match_result
