from typing import List
from ..schemas.matching_schema import BatchMatchRequest, BatchMatchResponse, MatchAnalysisResponse
from ..services.matching_engine import compute_match_analysis
from ..services.resume_parser import parse_resume
from ..services.llm_service import enhance_with_llm

def rank_candidates(batch: BatchMatchRequest) -> BatchMatchResponse:
    """Processes multiple applications for a job, calculates scores, and ranks them."""
    results: List[MatchAnalysisResponse] = []
    
    for app in batch.applications:
        # Determine parsed resume
        if app.parsed_resume:
            parsed = app.parsed_resume
        elif app.resume_text:
            parsed = parse_resume(app.resume_text)
        else:
            continue
            
        if app.candidate_name and not parsed.candidate_name:
            parsed.candidate_name = app.candidate_name
            
        match_res = compute_match_analysis(parsed, batch.job, application_id=app.application_id)
        match_res = enhance_with_llm(match_res, parsed, batch.job)
        results.append(match_res)

    # Sort candidates by overall score descending
    results.sort(
        key=lambda x: (x.overall_match_score, x.required_skills_score, x.experience_score),
        reverse=True
    )
    
    return BatchMatchResponse(
        job_id=batch.job.job_id,
        total_applications=len(results),
        ranked_candidates=results
    )
