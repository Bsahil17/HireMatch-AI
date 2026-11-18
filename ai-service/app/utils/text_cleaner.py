import re
from typing import Optional, List

def clean_text(text: Optional[str]) -> str:
    if not text:
        return ""
    # Normalize unicode spaces & linebreaks
    text = re.sub(r'[\r\f\v]', '\n', text)
    # Remove excessive blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Remove control characters except tab and newline
    text = re.sub(r'[^\x20-\x7E\t\n]', ' ', text)
    # Collapse consecutive spaces
    text = re.sub(r'[ \t]{2,}', ' ', text)
    return text.strip()

def extract_email(text: str) -> Optional[str]:
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    matches = re.findall(email_pattern, text)
    if matches:
        return matches[0].lower().strip()
    return None

def extract_phone(text: str) -> Optional[str]:
    # Matches international or domestic phone numbers like +1 (555) 019-2834, +91 9876543210, etc.
    phone_pattern = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    matches = re.findall(phone_pattern, text)
    if matches:
        return matches[0].strip()
    return None

def extract_candidate_name(text: str, fallback_email: Optional[str] = None) -> Optional[str]:
    # Commonly candidate name is in the first 2-3 lines of a resume
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        for line in lines[:4]:
            # Skip if line looks like header, phone, or email
            if '@' in line or any(char.isdigit() for char in line) or len(line) > 40:
                continue
            words = line.split()
            if 2 <= len(words) <= 4 and all(w.isalpha() for w in words):
                return line.title()
    if fallback_email:
        username = fallback_email.split('@')[0]
        name_parts = re.split(r'[._-]', username)
        if len(name_parts) >= 2:
            return " ".join([p.capitalize() for p in name_parts if p.isalpha()])
    return "Candidate"
