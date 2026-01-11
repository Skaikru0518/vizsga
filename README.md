# ReadList - Book Tracking Application

A modern web application for managing your personal book collection. Track books you've read, books on your bookshelf, and books you've purchased.

## Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Axios** - HTTP client for API requests

### Backend

- **Django 6.0** - Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **Simple JWT** - JWT authentication for Django
- **Pillow** - Python imaging library for book covers
- **drf-spectacular** - OpenAPI 3.0 schema generation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (Package manager)
- **Python** (v3.10 or higher)
- **pip** (Python package manager)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vizsga
```

### 2. Backend Setup (Django)

#### Create and Activate Virtual Environment

**Windows:**

```bash
python -m venv myvenv
myvenv\Scripts\activate
```

**macOS/Linux:**

```bash
python3 -m venv myvenv
source myvenv/bin/activate
```

#### Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Run Database Migrations

```bash
python manage.py migrate
```

#### Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

#### Create Media Directory

The media directory is located in `backend/booklist/media` and should already exist. If not, create it:

```bash
cd backend
mkdir -p booklist/media/images
```

### 3. Frontend Setup (Next.js)

```bash
cd ../frontend
pnpm install
```

### 4. Environment Variables

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
NODE_ENV="development"
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000/api"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

**Note:** Backend environment variables (SECRET_KEY, DEBUG, CORS settings) are configured directly in `backend/backend/config/settings.py` - no separate `.env` file is needed for the backend.

## Running the Application

You'll need **two terminal windows** - one for the backend and one for the frontend.

### Terminal 1: Backend (Django)

```bash
# Activate virtual environment first
cd backend
python manage.py runserver
```

The backend API will run at `http://localhost:8000`

### Terminal 2: Frontend (Next.js)

```bash
cd frontend
pnpm dev
```

The frontend will run at `http://localhost:3000`

## Default Ports

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Django Admin:** http://localhost:8000/admin
- **API Documentation:** http://localhost:8000/api/docs

## Features

### User Features

- User registration and authentication (JWT)
- Browse all books in the database
- Mark books as read, bought, or on bookshelf
- Personal book collection page with statistics
- Search and filter books
- Responsive design for mobile and desktop
- Password change functionality
- User profile management

### Admin Features

- User management (activate/deactivate, staff/superuser permissions)
- Book management (CRUD operations)
- View all users and their uploaded books
- Full control over book covers and metadata

## Project Structure

```
vizsga/
├── backend/
│   ├── backend/
│   │   ├── config/
│   │   │   ├── settings.py      # Django settings
│   │   │   ├── urls.py          # URL routing
│   │   │   └── wsgi.py
│   │   ├── booklist/
│   │   │   ├── models.py        # Database models
│   │   │   ├── serializer.py    # DRF serializers
│   │   │   ├── views.py         # API endpoints
│   │   │   └── urls.py          # App-level routing
│   │   ├── media/               # Uploaded book covers
│   │   ├── manage.py
│   │   └── db.sqlite3           # SQLite database
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js pages (App Router)
│   │   ├── components/           # React components
│   │   ├── context/              # React Context (Auth)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities and API routes
│   │   └── interface/            # TypeScript interfaces
│   ├── public/                   # Static assets
│   ├── package.json
│   └── .env                      # Environment variables
├── myvenv/                       # Python virtual environment
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/login/` - User login
- `POST /api/register/` - User registration
- `POST /api/change-password/` - Change password

### Books

- `GET /api/books/` - List all books
- `POST /api/books/` - Create a new book (authenticated)
- `GET /api/books/{id}/` - Get book details
- `PATCH /api/books/{id}/` - Update book (owner only)
- `DELETE /api/books/{id}/` - Delete book (owner only)

### Book Marks

- `POST /api/books/{id}/mark/` - Mark a book
- `PATCH /api/books/{id}/mark/` - Update mark
- `DELETE /api/books/{id}/mark/` - Remove mark

### User Profile

- `GET /api/profile/` - Get user profile
- `PATCH /api/profile/` - Update user profile

### Admin (Superuser only)

- `GET /api/admin/users/` - List all users
- `PATCH /api/admin/users/{id}/` - Update user
- `DELETE /api/admin/users/{id}/` - Delete user
- `GET /api/admin/books/` - List all books
- `PATCH /api/admin/books/{id}/` - Update any book
- `DELETE /api/admin/books/{id}/` - Delete any book

## Development Tips

### Backend

- Use `python manage.py shell` for interactive Python shell
- Run `python manage.py makemigrations` after model changes
- Check API documentation at `/api/docs`

### Frontend

- Run `pnpm lint` to check code quality
- Use `pnpm build` to test production build
- Frontend uses controlled components with form validation

## Troubleshooting

### Backend Issues

**Database locked error:**

```bash
# Delete db.sqlite3 and re-run migrations
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

**CORS errors:**

- CORS is currently set to allow all origins (`CORS_ORIGIN_ALLOW_ALL = True` in `settings.py`)
- If you need to restrict origins, modify the `settings.py` file to use `CORS_ALLOWED_ORIGINS` instead

**Media files not loading:**

- Ensure `backend/backend/booklist/media/` directory exists
- Check `MEDIA_URL` and `MEDIA_ROOT` in `config/settings.py`

### Frontend Issues

**API connection failed:**

- Verify `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BACKEND_URL` in `.env`
- Ensure backend server is running on port 8000

**pnpm not found:**

```bash
npm install -g pnpm
```

## License

This project is for educational purposes.
