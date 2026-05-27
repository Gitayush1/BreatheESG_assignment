# Setup Guide

## Prerequisites

### Backend Requirements
- Python 3.10 or higher
- pip (Python package manager)
- Virtual environment tool (venv)

### Frontend Requirements
- Node.js 18 or higher
- npm or yarn

### Optional
- PostgreSQL (for production)
- Git

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
```bash
# Copy example env file
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env file with your settings
# For development, defaults are fine
```

### 5. Run Database Migrations
```bash
python manage.py migrate
```

### 6. Create Demo Data
```bash
python manage.py setup_demo_data
```

This creates:
- Demo user: `analyst@breatheesg.com` / `demo2026`
- Demo organization: "Demo Corporation"
- Three data sources (SAP, Utility, Corporate Travel)

### 7. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 8. Run Development Server
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

Admin interface: `http://localhost:8000/admin`

API endpoints: `http://localhost:8000/api/`

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy example env file
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env file
# Default: REACT_APP_API_URL=http://localhost:8000/api
```

### 4. Start Development Server
```bash
npm start
```

Frontend will be available at: `http://localhost:3000`

The app will automatically open in your browser.

---

## Testing the Application

### 1. Login
- Navigate to `http://localhost:3000`
- Use credentials: `analyst@breatheesg.com` / `demo2026`

### 2. Upload Sample Data

#### Option A: Via Web Interface
1. Go to "Upload Data" page
2. Select a data source (SAP, Utility, or Corporate Travel)
3. Choose a sample file from `backend/sample_data/`
4. Click "Upload and Process"

#### Option B: Via Admin Interface
1. Go to `http://localhost:8000/admin`
2. Login with superuser credentials
3. Navigate to "Raw data uploads"
4. Add new upload

### 3. Review Records
1. Go to "Review Queue" page
2. Click "Review" on any pending record
3. Add notes and approve or reject

### 4. View Dashboard
1. Go to "Dashboard" page
2. See statistics and emissions by scope

### 5. Browse All Records
1. Go to "Emission Records" page
2. Use filters to search
3. View detailed information

---

## API Testing

### Using curl

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"analyst@breatheesg.com\",\"password\":\"demo2026\"}"
```

#### Get Emission Records
```bash
curl http://localhost:8000/api/emission-records/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

#### Get Statistics
```bash
curl http://localhost:8000/api/emission-records/statistics/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the API endpoints
2. Set base URL: `http://localhost:8000/api`
3. Add Authorization header: `Token YOUR_TOKEN_HERE`

---

## Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Use different port
python manage.py runserver 8001
```

#### Database Locked (SQLite)
```bash
# Stop all Django processes
# Delete db.sqlite3
# Run migrations again
python manage.py migrate
python manage.py setup_demo_data
```

#### Module Not Found
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

#### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill
```

#### CORS Errors
- Ensure backend is running
- Check CORS_ALLOWED_ORIGINS in backend settings
- Verify REACT_APP_API_URL in frontend .env

#### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Development Tips

### Backend

#### Run Migrations After Model Changes
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Access Django Shell
```bash
python manage.py shell
```

#### Create Test Data
```python
from emissions.models import *
from django.contrib.auth.models import User

# Create organization
org = Organization.objects.create(name="Test Org")

# Create data source
source = DataSource.objects.create(
    organization=org,
    name="Test Source",
    source_type="SAP"
)
```

#### View SQL Queries
```python
from django.db import connection
print(connection.queries)
```

### Frontend

#### Clear Browser Cache
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear localStorage: Open DevTools → Application → Local Storage → Clear

#### Debug API Calls
- Open DevTools → Network tab
- Filter by XHR
- Check request/response

#### Component Development
```bash
# Run with hot reload
npm start

# Build for production
npm run build
```

---

## Next Steps

1. **Customize Emission Factors**: Update factors in `emissions/ingestion.py`
2. **Add More Data Sources**: Extend the ingestion service
3. **Customize UI**: Modify Material-UI theme in `App.js`
4. **Add Validation Rules**: Enhance data validation logic
5. **Deploy to Production**: See DEPLOYMENT.md

---

## Useful Commands

### Backend
```bash
# Run tests (when added)
python manage.py test

# Collect static files
python manage.py collectstatic

# Create database backup
python manage.py dumpdata > backup.json

# Load database backup
python manage.py loaddata backup.json
```

### Frontend
```bash
# Run tests
npm test

# Build for production
npm run build

# Analyze bundle size
npm run build -- --stats
```

---

## Getting Help

- Check error logs in terminal
- Review Django debug page (when DEBUG=True)
- Check browser console for frontend errors
- Review API responses in Network tab
- Consult Django documentation: https://docs.djangoproject.com
- Consult React documentation: https://react.dev
