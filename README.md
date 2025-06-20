# BuildLine Portal

A full-stack web application for construction project management.

## Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   └── utils/          # Utility functions
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile         # Backend Dockerfile
└── frontend/              # React frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── hooks/         # Custom hooks
    │   └── i18n/          # Internationalization
    └── package.json      # Node.js dependencies
```

## Prerequisites

- Python 3.10+
- Node.js 16+
- MySQL 8.0+

## Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
export DATABASE_URL="mysql+aiomysql://user:password@localhost/dbname"
export JWT_SECRET="your-secret-key"
export JWT_ALGORITHM="HS256"
export JWT_EXPIRATION=3600
```

4. Run the backend:
```bash
uvicorn main:app --reload --port 8000
```

## Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the frontend:
```bash
npm start
```

## API Documentation

The API documentation is available at `http://localhost:8000/docs` when the backend is running.

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

## Database Schema

The application uses MySQL with the following main tables:
- users
- projects
- events
- wiki_pages
- project_files
- wiki_files

## Features

- User Authentication with JWT
- Role-based Access Control
- Project Management
- Event Calendar
- Wiki Documentation
- File Management
- Internationalization (English and Georgian)

## Development

To run both frontend and backend in development mode:

1. Start the backend:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. In another terminal, start the frontend:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Production Deployment

For production deployment, use the provided Dockerfile:

```bash
# Build backend
cd backend
docker build -t buildline-backend .

# Run backend
docker run -d -p 8000:8000 buildline-backend

# Build frontend
cd frontend
npm run build
```

## License

This project is proprietary and confidential.
