import os
from typing import Optional
try:
    from pydantic_settings import BaseSettings
    class BaseSettingsClass(BaseSettings):
        class Config:
            env_file = ".env"
            extra = "ignore"
except ImportError:
    from pydantic import BaseModel
    class BaseSettingsClass(BaseModel):
        pass

class Settings(BaseSettingsClass):
    APP_NAME: str = "Hire Match AI - Intelligence Service"
    API_PREFIX: str = "/ai"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # LLM Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "LOCAL").upper() # "GEMINI", "OPENAI", "LOCAL"
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "gemini-1.5-flash")
    LLM_TIMEOUT_SECONDS: int = int(os.getenv("LLM_TIMEOUT_SECONDS", "10"))
    
    # Scoring Weights (Total 100%)
    WEIGHT_REQUIRED_SKILLS: float = 0.50
    WEIGHT_PREFERRED_SKILLS: float = 0.15
    WEIGHT_EXPERIENCE: float = 0.15
    WEIGHT_EDUCATION: float = 0.10
    WEIGHT_PROJECTS: float = 0.10

settings = Settings()
