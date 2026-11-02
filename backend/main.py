"""
LeadLens Backend FastAPI Application Entrypoint.
Provides production-style ML scoring, model governance, and health endpoints.
"""
from contextlib import asynccontextmanager
import logging
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api import api_router
from backend.core.config import (
    API_DESCRIPTION,
    API_TITLE,
    API_VERSION,
    CORS_ORIGINS,
)
from backend.services.model_service import model_service

# Configure standard server logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("leadlens.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan manager.
    Loads winning ML model pipeline and metadata exactly once at startup.
    Fails fast with clear diagnostic logging if artifacts are missing.
    """
    logger.info("Initializing LeadLens API service...")
    try:
        model_service.load_artifacts()
        logger.info(
            "LeadLens model pipeline '%s' (%s) initialized successfully.",
            model_service.model_name,
            model_service.model_version,
        )
    except Exception as exc:
        logger.critical(
            "FATAL: Failed to load model artifacts during startup: %s",
            exc,
            exc_info=True,
        )
        # Re-raise so FastAPI application fails fast and clearly
        raise RuntimeError(f"Startup aborted due to model artifact error: {exc}") from exc

    yield

    logger.info("Shutting down LeadLens API service...")


app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for React development and configurable production environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Register main API routes under /api
app.include_router(api_router, prefix="/api")


@app.get("/", include_in_schema=False)
async def root():
    """Root redirect / index message."""
    return {
        "service": API_TITLE,
        "version": API_VERSION,
        "status": "running",
        "docs_url": "/docs",
        "api_prefix": "/api",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
