import unittest
from app.services.resume_parser import parse_resume
from app.services.skill_extractor import extract_skills_from_text, categorize_skills
from app.utils.text_cleaner import clean_text, extract_email, extract_phone

SAMPLE_RESUME = """
John Doe
Software Engineer | Full Stack Developer
Email: john.doe@example.com | Phone: (555) 123-4567
Austin, Texas

SUMMARY:
Results-driven software engineer with 4 years of experience building resilient microservices and web platforms.

TECHNICAL SKILLS:
Programming Languages: Java, Python, JavaScript, TypeScript, SQL
Frameworks & Libraries: Spring Boot, React, Next.js, Hibernate, Node.js
Databases: MySQL, PostgreSQL, Redis, MongoDB
DevOps & Cloud: Docker, Kubernetes, AWS, Git, CI/CD
APIs & Other: REST APIs, Kafka, Microservices, JUnit

PROFESSIONAL EXPERIENCE:
Senior Java Developer at Acme Corp
2021 - Present
- Architected enterprise REST APIs using Java 17 and Spring Boot microservices.
- Integrated MySQL database using Hibernate JPA with sub-50ms query latency.
- Containerized services with Docker and deployed onto AWS Kubernetes clusters.

Software Engineer at TechFlow Inc
2020 - 2021
- Developed interactive web user interfaces using React and Tailwind CSS.
- Implemented event-driven message queuing with Apache Kafka.

EDUCATION:
Bachelor of Technology in Computer Science
University of Texas, 2020
"""

def test_text_cleaning():
    dirty = "John   Doe \r\n\r\n\r\n Java \t\t Developer "
    cleaned = clean_text(dirty)
    assert "John Doe" in cleaned
    assert "Java Developer" in cleaned

def test_contact_extraction():
    email = extract_email(SAMPLE_RESUME)
    phone = extract_phone(SAMPLE_RESUME)
    assert email == "john.doe@example.com"
    assert "123-4567" in phone

def test_skill_extraction():
    skills = extract_skills_from_text(SAMPLE_RESUME)
    assert "Java" in skills
    assert "Spring Boot" in skills
    assert "MySQL" in skills
    assert "React" in skills
    assert "Docker" in skills
    assert "AWS" in skills

def test_full_resume_parsing():
    parsed = parse_resume(SAMPLE_RESUME)
    assert parsed.candidate_name == "John Doe"
    assert parsed.email == "john.doe@example.com"
    assert parsed.estimated_experience_years >= 3.0
    assert "Java" in parsed.technical_skills
    assert "Spring Boot" in parsed.technical_skills
    assert len(parsed.education) >= 1
    assert "Bachelor" in parsed.education[0].degree
