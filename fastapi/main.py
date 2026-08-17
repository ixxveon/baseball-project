from fastapi import FastAPI

from api.v1.router import api_router
from core.config import settings

app = FastAPI(title=settings.app_name)
app.include_router(api_router, prefix="/api/v1")
