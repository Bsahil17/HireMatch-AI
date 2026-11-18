import re
from datetime import datetime
from typing import List, Tuple
from ..schemas.resume_schema import ExperienceItem

YEAR_NOW = datetime.now().year

def extract_years_of_experience(text: str) -> float:
    """
    Extracts numerical years of experience from resume text.
    Combines explicit statements and parsed employment date ranges.
    """
    if not text:
        return 0.0

    lower = text.lower()
    
    # 1. Look for direct statements: "X+ years of experience", "X years experience"
    exp_patterns = [
        r'(\d+(?:\.\d+)?)\+?\s*(?:-\s*\d+)?\s*(?:years|yrs)\s*(?:of)?\s*(?:experience|exp)',
        r'(?:experience|exp)\s*:\s*(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)',
        r'over\s*(\d+(?:\.\d+)?)\s*years\s*(?:of)?\s*experience'
    ]
    
    for pattern in exp_patterns:
        match = re.search(pattern, lower)
        if match:
            try:
                years = float(match.group(1))
                if 0 <= years <= 40:
                    return years
            except ValueError:
                pass
                
    # 2. Look for date ranges in experience sections (e.g., 2018 - 2022, 2020 - Present)
    date_ranges = re.findall(r'(20\d{2}|19\d{2})\s*(?:-|to|–)\s*(20\d{2}|present|current)', lower)
    total_months = 0
    if date_ranges:
        for start_str, end_str in date_ranges:
            try:
                start_year = int(start_str)
                end_year = YEAR_NOW if any(k in end_str for k in ['present', 'current']) else int(end_str)
                diff = max(0, end_year - start_year)
                if diff <= 30:
                    total_months += diff * 12
            except ValueError:
                pass
        if total_months > 0:
            return round(min(total_months / 12.0, 30.0), 1)

    return 1.0 # Default baseline if professional experience is present but not quantified

def extract_work_experience_items(text: str) -> List[ExperienceItem]:
    """Identifies individual work experience snippets and companies."""
    items: List[ExperienceItem] = []
    lines = text.split('\n')
    
    role_keywords = ['developer', 'engineer', 'architect', 'lead', 'manager', 'consultant', 'intern', 'analyst', 'specialist']
    company_connectors = ['at', '@', '|', '-', ',']
    
    for line in lines:
        clean = line.strip()
        lower = clean.lower()
        if any(rk in lower for rk in role_keywords) and len(clean) < 90:
            # Check for company
            parts = re.split(r'\s+(?:at|@|\||-)\s+', clean, flags=re.IGNORECASE)
            if len(parts) >= 2:
                role = parts[0].strip()
                company = parts[1].strip()
                items.append(ExperienceItem(role=role, company=company))
            else:
                items.append(ExperienceItem(role=clean))
                
        if len(items) >= 5: # Limit to top 5
            break
            
    return items
