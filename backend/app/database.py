from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import aiomysql
import logging
from urllib.parse import quote_plus

from .config import Config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Construct database URL with explicit host
DATABASE_URL = f"mysql+aiomysql://{Config.MYSQL_USER}:{quote_plus(Config.MYSQL_PASSWORD)}@{Config.MYSQL_HOST}/{Config.MYSQL_DATABASE}"

logger.info(f"Using database URL: {DATABASE_URL}")

# Create async engine with connect_args to ensure correct host
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args={
        "host": "48.217.185.81",  # Explicitly set host
        "port": 3306,
        "user": Config.MYSQL_USER,
        "password": Config.MYSQL_PASSWORD,
        "db": Config.MYSQL_DATABASE,
    }
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Create declarative base for models
Base = declarative_base()

async def init_db():
    """Initialize database by creating all tables"""
    try:
        logger.info(f"Attempting to connect to database at {Config.MYSQL_HOST}")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database initialization successful")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise

@asynccontextmanager
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for getting async database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            logger.error(f"Database session error: {str(e)}")
            await session.rollback()
            raise
        finally:
            await session.close()

# Connection management
async def close_db_connections():
    """Close all database connections"""
    await engine.dispose()
