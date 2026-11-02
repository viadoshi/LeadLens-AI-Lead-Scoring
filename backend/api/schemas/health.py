"""Pydantic schema for health check endpoint."""
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Health check status response."""
    status: str = Field(..., description="Overall service status (e.g. 'ok')", examples=["ok"])
    model_loaded: bool = Field(..., description="Flag indicating if the ML model pipeline is active", examples=[True])
