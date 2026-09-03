from fastapi import APIRouter

from api.v1.endpoints import health
from service.api import prediction_router

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(prediction_router.router)
