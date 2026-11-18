import unittest
from app.schemas.matching_schema import JobRequirement
from app.services.resume_parser import parse_resume
from app.services.matching_engine import compute_match_analysis

JAVA_JOB = JobRequirement(
    job_id=1,
    title="Senior Java Developer",
    department="Engineering",
    required_skills=["Java", "Spring Boot", "MySQL", "REST APIs", "Hibernate"],
    preferred_skills=["Docker", "AWS", "React"],
    min_experience_years=3.0,
    max_experience_years=6.0,
    required_education="Bachelor"
)

STRONG_RESUME = """
Alex Rivera
Email: alex@example.com
Phone: (555) 987-6543
Java Developer with 4 years experience.
Skills: Java, Spring Boot, MySQL, REST APIs, Hibernate, Docker, AWS, React, Git
Education: Bachelor of Technology in Computer Science, 2020
"""

WEAK_RESUME = """
Jane Graphic Designer
Email: jane@example.com
Phone: (555) 321-4321
Skills: Figma, Photoshop, Illustrator, HTML, CSS
Experience: 1 year experience
Education: Bachelor of Arts
"""

def test_strong_matching():
    parsed = parse_resume(STRONG_RESUME)
    result = compute_match_analysis(parsed, JAVA_JOB)
    
    assert result.overall_match_score >= 85
    assert result.recommendation == "Strong Match"
    assert len(result.missing_skills) == 0
    assert "Java" in result.matched_skills
    assert "Spring Boot" in result.matched_skills
    assert "Docker" in result.preferred_skills_matched
    assert result.experience_match is True

def test_weak_matching():
    parsed = parse_resume(WEAK_RESUME)
    result = compute_match_analysis(parsed, JAVA_JOB)
    
    assert result.overall_match_score < 50
    assert result.recommendation == "Low Match"
    assert len(result.missing_skills) >= 4
    assert result.experience_match is False

def test_partial_matching():
    partial_text = """
    Bob Junior
    bob@example.com
    Skills: Java, SQL, Git
    Experience: 2 years experience
    Education: Bachelor of Science
    """
    parsed = parse_resume(partial_text)
    result = compute_match_analysis(parsed, JAVA_JOB)
    assert 25 <= result.overall_match_score <= 60
