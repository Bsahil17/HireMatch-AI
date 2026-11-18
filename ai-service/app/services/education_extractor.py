import re
from typing import List
from ..schemas.resume_schema import EducationItem

DEGREE_PATTERNS = [
    (r'\b(?:b\.?tech|bachelor of technology|b\.?e\.?|bachelor of engineering)\b', 'Bachelor of Technology'),
    (r'\b(?:b\.?s\.?|b\.?sc|bachelor of science)\b', 'Bachelor of Science'),
    (r'\b(?:b\.?c\.?a\.?|bachelor of computer applications)\b', 'Bachelor of Computer Applications'),
    (r'\b(?:m\.?tech|master of technology|m\.?e\.?|master of engineering)\b', 'Master of Technology'),
    (r'\b(?:m\.?s\.?|m\.?sc|master of science)\b', 'Master of Science'),
    (r'\b(?:m\.?c\.?a\.?|master of computer applications)\b', 'Master of Computer Applications'),
    (r'\b(?:m\.?b\.?a\.?|master of business administration)\b', 'Master of Business Administration'),
    (r'\b(?:ph\.?d|doctor of philosophy|doctorate)\b', 'Ph.D in Computer Science / Engineering'),
]

INSTITUTION_KEYWORDS = ['university', 'college', 'institute', 'polytechnic', 'school', 'academy', 'iit', 'nit', 'bits']

def extract_education_items(text: str) -> List[EducationItem]:
    items: List[EducationItem] = []
    lines = text.split('\n')
    
    current_degree = None
    current_inst = None
    current_year = None
    
    # 1. Look for known degrees
    for line in lines:
        clean = line.strip()
        lower = clean.lower()
        
        detected_degree = None
        for pattern, degree_label in DEGREE_PATTERNS:
            if re.search(pattern, lower):
                detected_degree = degree_label
                break
                
        detected_inst = None
        for keyword in INSTITUTION_KEYWORDS:
            if keyword in lower and len(clean) < 100:
                detected_inst = clean
                break
                
        # Look for graduation year (1990 - 2030)
        year_match = re.search(r'\b(199\d|20[0-2]\d|2030)\b', clean)
        detected_year = int(year_match.group(1)) if year_match else None
        
        if detected_degree or detected_inst:
            items.append(EducationItem(
                degree=detected_degree or "Bachelor's Degree",
                institution=detected_inst,
                year=detected_year
            ))
            
        if len(items) >= 3:
            break
            
    # Default fallback if no specific line matched but keyword exists
    if not items and any(re.search(pat, text.lower()) for pat, _ in DEGREE_PATTERNS):
        items.append(EducationItem(degree="Bachelor of Science / Technology", institution="Accredited University"))
        
    return items
