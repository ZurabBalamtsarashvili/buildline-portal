from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from .database import engine, Base
from .routes import auth, projects, wiki, events, notifications, google_drive_upload
from .utils.error_handler import handle_validation_error, handle_sqlalchemy_error

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Exception handlers
app.add_exception_handler(RequestValidationError, handle_validation_error)
app.add_exception_handler(SQLAlchemyError, handle_sqlalchemy_error)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(wiki.router, prefix="/api/wiki", tags=["wiki"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(google_drive_upload.router, prefix="/api/upload", tags=["upload"])

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

# Create database tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("startup")
async def startup_event():
    await create_tables()
