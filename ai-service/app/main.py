from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.routes.resume_routes import router as resume_router
from .api.routes.matching_routes import router as matching_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Intelligent AI resume parsing, skill extraction, and candidate-job matching service.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(resume_router, prefix=settings.API_PREFIX)
app.include_router(matching_router, prefix=settings.API_PREFIX)

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "UP",
        "service": settings.APP_NAME,
        "llm_provider": settings.LLM_PROVIDER,
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
