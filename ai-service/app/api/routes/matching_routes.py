from fastapi import APIRouter, HTTPException
from ...schemas.matching_schema import (
    CandidateApplicationMatchRequest,
    MatchAnalysisResponse,
    BatchMatchRequest,
    BatchMatchResponse
)
from ...services.matching_engine import compute_match_analysis
from ...services.resume_parser import parse_resume
from ...services.llm_service import enhance_with_llm
from ...services.ranking_service import rank_candidates

router = APIRouter(tags=["AI Matching & Ranking"])

@router.post("/match-resume", response_model=MatchAnalysisResponse)
async def api_match_resume(request: CandidateApplicationMatchRequest):
    """
    Evaluates a candidate's resume against job requirements.
    Calculates explainable matching score, matched skills, gaps, and recommendations.
    """
    if request.parsed_resume:
        parsed = request.parsed_resume
    elif request.resume_text:
        parsed = parse_resume(request.resume_text)
    else:
        raise HTTPException(
            status_code=400,
            detail="Either 'parsed_resume' or 'resume_text' must be provided."
        )

    if request.candidate_name and not parsed.candidate_name:
        parsed.candidate_name = request.candidate_name

    # Deterministic scoring
    match_result = compute_match_analysis(
        parsed=parsed,
        job=request.job,
        application_id=request.application_id
    )
    
    # Optional LLM contextual enrichment (with local fallback)
    enriched = enhance_with_llm(match_result, parsed, request.job)
    return enriched

@router.post("/batch-match", response_model=BatchMatchResponse)
async def api_batch_match(batch: BatchMatchRequest):
    """
    Batches multiple candidate applications against a job opening,
    derives matching scores, and ranks them in descending order.
    """
    return rank_candidates(batch)
