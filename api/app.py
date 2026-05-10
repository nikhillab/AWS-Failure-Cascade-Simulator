from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.simulation_routes import router


# -------------------------------------------------------------------
# App Initialization
# -------------------------------------------------------------------

app = FastAPI(title="AWS Failure Cascade Simulator API")

# -------------------------------------------------------------------
# CORS Middleware
# -------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# Routes
# -------------------------------------------------------------------

@app.get("/")
async def root():
    return {
        "service": "AWS Failure Cascade Simulator API",
        "status": "healthy",
    }

# -------------------------------------------------------------------
# Include Routers
# -------------------------------------------------------------------

app.include_router(router)


# -------------------------------------------------------------------
# Local Development
# -------------------------------------------------------------------

# Run with:
# uvicorn app:app --reload

