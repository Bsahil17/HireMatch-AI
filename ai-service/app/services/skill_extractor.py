import re
from typing import List, Set, Dict
from ..utils.skill_normalizer import SKILL_MAP, SKILL_CATEGORIES, normalize_skill
from ..schemas.resume_schema import SkillCategoryBreakdown

def extract_skills_from_text(text: str) -> List[str]:
    """
    Extracts canonical skills from unstructured text using boundary-aware regex matching.
    """
    if not text:
        return []
        
    lower_text = f" {text.lower()} "
    found_canonical_skills: Set[str] = set()
    
    for canonical_name, aliases in SKILL_MAP.items():
        # Match canonical name and all known aliases
        for alias in [canonical_name.lower()] + [a.lower() for a in aliases]:
            # Handle special symbols like c++, c#, .net
            escaped_alias = re.escape(alias)
            # Match with boundary check: not preceded/followed by letters/digits
            pattern = rf'(?<![a-zA-Z0-9_]){escaped_alias}(?![a-zA-Z0-9_])'
            if re.search(pattern, lower_text):
                found_canonical_skills.add(canonical_name)
                break
                
    return sorted(list(found_canonical_skills))

def categorize_skills(skills: List[str]) -> SkillCategoryBreakdown:
    """Categorizes a list of canonical skills into structured domains."""
    breakdown = SkillCategoryBreakdown()
    
    for skill in skills:
        placed = False
        for cat_key, cat_skills in SKILL_CATEGORIES.items():
            if skill in cat_skills:
                getattr(breakdown, cat_key).append(skill)
                placed = True
                break
        if not placed:
            breakdown.tools_other.append(skill)
            
    return breakdown
