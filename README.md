# My Diary Personal Diary Application

A personal diary application with internationalization support, built with Next.js for the frontend and FastAPI for the backend.

## Project Structure

```
mydiary/
├── frontend/          # Next.js frontend project
│   ├── src/           # Source code directory
│   │   ├── components/  # Components
│   │   ├── pages/     # Pages
│   │   ├── locales/   # Internationalization files
│   │   ├── utils/     # Utility functions
│   │   └── styles/    # Style files
│   ├── public/        # Static resources
│   └── package.json   # Frontend dependencies
│
├── backend/           # FastAPI backend project
│   ├── app/           # Application code
│   └── requirements.txt # Backend dependencies
│
└── docker-compose.yml # Docker configuration
```

## Features

- English and Chinese internationalization support
- Responsive interface design
- Diary writing and management
- User authentication and authorization

## Development Environment Setup

### Frontend (Next.js)

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

The frontend development server will start at http://localhost:3000.

### Backend (FastAPI)

1. Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# or
.venv\Scripts\activate  # Windows
```

2. Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

3. Start the development server:

```bash
uvicorn app.main:app --reload
```

The backend API will start at http://localhost:8000.

## Using Docker

Start the entire application with Docker Compose:

```bash
docker-compose up -d
```

## Internationalization Usage

The frontend project supports switching between English and Chinese. See `frontend/src/docs/i18n-guide.md` for more information about internationalization usage. 