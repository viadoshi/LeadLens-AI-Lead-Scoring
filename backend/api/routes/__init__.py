"""API routes aggregator."""
from fastapi import APIRouter
from backend.api.routes.analytics import router as analytics_router
from backend.api.routes.campaigns import router as campaigns_router
from backend.api.routes.health import router as health_router
from backend.api.routes.model_info import router as model_info_router
from backend.api.routes.prediction import router as prediction_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(model_info_router)
api_router.include_router(prediction_router)
api_router.include_router(analytics_router)
api_router.include_router(campaigns_router)

__all__ = ["api_router"]
