import asyncio
import aiomysql
from app.config import Config

async def test_connection():
    try:
        print(f"Attempting to connect to MySQL at {Config.MYSQL_HOST}")
        print(f"User: {Config.MYSQL_USER}")
        print(f"Database: {Config.MYSQL_DATABASE}")
        
        conn = await aiomysql.connect(
            host=Config.MYSQL_HOST,
            port=3306,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            db=Config.MYSQL_DATABASE
        )
        
        print("Successfully connected to the database!")
        await conn.close()
        print("Connection closed.")
        return True
    except Exception as e:
        print(f"Failed to connect to the database: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
