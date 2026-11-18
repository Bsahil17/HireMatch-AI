from typing import List, Set, Tuple
from ..config import settings
from ..schemas.matching_schema import JobRequirement, MatchAnalysisResponse
from ..schemas.resume_schema import ParsedResumeResponse
from ..utils.skill_normalizer import find_matched_skill, normalize_skill

def compute_match_analysis(
    parsed: ParsedResumeResponse,
    job: JobRequirement,
    application_id: int = None
) -> MatchAnalysisResponse:
    """
    Executes a strict, deterministic, explainable scoring algorithm comparing candidate
    profile with job requirements.
    """
    candidate_skills = set(parsed.technical_skills)
    
    # 1. Required Skills Match (Weight: 50%)
    matched_required: List[str] = []
    missing_required: List[str] = []
    
    for req in job.required_skills:
        found, canonical_name = find_matched_skill(req, candidate_skills)
        if found:
            matched_required.append(canonical_name)
        else:
            missing_required.append(canonical_name)
            
    total_req_count = len(job.required_skills)
    if total_req_count > 0:
        req_ratio = len(matched_required) / total_req_count
    else:
        req_ratio = 1.0
    req_score = req_ratio * 100.0

    # 2. Preferred Skills Match (Weight: 15%)
    matched_pref: List[str] = []
    missing_pref: List[str] = []
    
    for pref in job.preferred_skills:
        found, canonical_name = find_matched_skill(pref, candidate_skills)
        if found:
            matched_pref.append(canonical_name)
        else:
            missing_pref.append(canonical_name)
            
    total_pref_count = len(job.preferred_skills)
    if total_pref_count > 0:
        pref_ratio = len(matched_pref) / total_pref_count
    else:
        pref_ratio = 1.0 if not job.preferred_skills else 0.5
    pref_score = pref_ratio * 100.0

    # 3. Experience Match (Weight: 15%)
    cand_exp = parsed.estimated_experience_years
    min_exp = job.min_experience_years
    max_exp = job.max_experience_years
    
    exp_match = False
    if cand_exp >= min_exp:
        if max_exp is None or cand_exp <= (max_exp + 2.0): # Graceful margin
            exp_match = True
            exp_score = 100.0
        else:
            # Over-experienced slightly discounted or full
            exp_match = True
            exp_score = 90.0
    else:
        # Partial credit if close (e.g. 1.5 yrs vs 2 yrs)
        if min_exp > 0:
            exp_score = min(100.0, max(0.0, (cand_exp / min_exp) * 80.0))
        else:
            exp_score = 100.0
            exp_match = True

    # 4. Education Match (Weight: 10%)
    edu_match = False
    cand_degrees = [e.degree.lower() for e in parsed.education if e.degree]
    target_edu = (job.required_education or "Bachelor").lower()
    
    if not job.required_education or any(target_edu in d for d in cand_degrees) or len(cand_degrees) > 0:
        edu_match = True
        edu_score = 100.0
    else:
        edu_score = 60.0 # Some credit for general qualification

    # 5. Projects & Relevant Context (Weight: 10%)
    project_score = 50.0 # baseline
    if parsed.projects:
        # check if candidate used required skills in projects
        project_skills_count = sum(len(p.technologies) for p in parsed.projects)
        project_score = min(100.0, 60.0 + (project_skills_count * 10.0))
    elif cand_exp >= 2.0:
        project_score = 85.0 # Proven work track record

    # Calculate Weighted Total (0 - 100)
    overall_score = (
        (req_score * settings.WEIGHT_REQUIRED_SKILLS) +
        (pref_score * settings.WEIGHT_PREFERRED_SKILLS) +
        (exp_score * settings.WEIGHT_EXPERIENCE) +
        (edu_score * settings.WEIGHT_EDUCATION) +
        (project_score * settings.WEIGHT_PROJECTS)
    )
    final_score = int(round(max(0.0, min(100.0, overall_score))))

    # Recommendation tier
    if final_score >= 85:
        recommendation = "Strong Match"
    elif final_score >= 70:
        recommendation = "Good Match"
    elif final_score >= 50:
        recommendation = "Moderate Match"
    else:
        recommendation = "Low Match"

    # Strengths and Gaps
    strengths = []
    gaps = []
    
    if req_ratio >= 0.8:
        strengths.append(f"Possesses {len(matched_required)}/{total_req_count} core required skills ({', '.join(matched_required[:3])})")
    elif matched_required:
        strengths.append(f"Proficient in key requirements: {', '.join(matched_required)}")
        
    if matched_pref:
        strengths.append(f"Bonus experience with preferred tools: {', '.join(matched_pref)}")
        
    if exp_match:
        strengths.append(f"Meets experience criteria with {cand_exp} years in software engineering")
    else:
        gaps.append(f"Has {cand_exp} years experience; role requests at least {min_exp} years")

    if missing_required:
        gaps.append(f"Missing core required skills: {', '.join(missing_required)}")
        
    if missing_pref:
        gaps.append(f"Lacks preferred skill proficiencies: {', '.join(missing_pref[:3])}")

    # Human-readable explanation
    explanation_parts = [
        f"Candidate scored {final_score}% ({recommendation}).",
        f"Core skills match: {len(matched_required)} of {total_req_count} required skills verified ({int(req_score)}%)."
    ]
    if missing_required:
        explanation_parts.append(f"Gap identified in: {', '.join(missing_required)}.")
    if matched_pref:
        explanation_parts.append(f"Bonus alignment on preferred stack: {', '.join(matched_pref)}.")
    if exp_match:
        explanation_parts.append(f"Experience expectation satisfied ({cand_exp} yrs).")
    else:
        explanation_parts.append(f"Candidate has {cand_exp} yrs vs {min_exp} yrs expected.")

    explanation = " ".join(explanation_parts)

    return MatchAnalysisResponse(
        application_id=application_id,
        candidate_name=parsed.candidate_name,
        overall_match_score=final_score,
        recommendation=recommendation,
        matched_skills=matched_required,
        missing_skills=missing_required,
        preferred_skills_matched=matched_pref,
        missing_preferred_skills=missing_pref,
        required_skills_score=round(req_score, 1),
        preferred_skills_score=round(pref_score, 1),
        experience_score=round(exp_score, 1),
        education_score=round(edu_score, 1),
        project_score=round(project_score, 1),
        experience_match=exp_match,
        education_match=edu_match,
        candidate_experience_years=cand_exp,
        candidate_strengths=strengths,
        candidate_gaps=gaps,
        explanation=explanation
    )
