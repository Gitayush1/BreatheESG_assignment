# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: psycopg2-binary Installation Error

**Error:**
```
Error: pg_config executable not found.
```

**Solution:**
For development with SQLite, you don't need psycopg2. The requirements.txt has been updated to exclude it.

If you need PostgreSQL support for production:
```bash
pip install psycopg2-binary
```

Or use the production requirements:
```bash
pip install -r requirements-prod.txt
```

---

### Issue 2: "no such table: emissions_organization"

**Error:**
```
django.db.utils.OperationalError: no such table: emissions_organization
```

**Solution:**
You need to run migrations BEFORE running setup_demo_data:

```bash
# Step 1: Run migrations to create tables
python manage.py migrate

# Step 2: Then setup demo data
python manage.py setup_demo_data
```

**Quick Fix (Windows):**
```bash
cd backend
setup.bat
```

**Quick Fix (macOS/Linux):**
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

---

### Issue 3: Port Already in Use

**Error:**
```
Error: That port is already in use.
```

**Solution (Windows):**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
python manage.py runserver 8001
```

**Solution (macOS/Linux):**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill

# Or use a different port
python manage.py runserver 8001
```

---

### Issue 4: Module Not Found

**Error:**
```
ModuleNotFoundError: No module named 'django'
```

**Solution:**
Make sure your virtual environment is activated:

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

Then reinstall dependencies:
```bash
pip install -r requirements.txt
```

---

### Issue 5: CORS Errors in Frontend

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
1. Check backend `.env` file has correct CORS settings:
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

2. Restart backend server after changing .env

3. Check frontend `.env` has correct API URL:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

### Issue 6: Frontend Won't Start

**Error:**
```
npm ERR! code ELIFECYCLE
```

**Solution:**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json  # macOS/Linux
# OR
rmdir /s /q node_modules               # Windows
del package-lock.json                  # Windows

npm install
npm start
```

---

### Issue 7: Database Locked (SQLite)

**Error:**
```
sqlite3.OperationalError: database is locked
```

**Solution:**
1. Stop all Django processes
2. Delete the database and start fresh:
```bash
del db.sqlite3                    # Windows
rm db.sqlite3                     # macOS/Linux

python manage.py migrate
python manage.py setup_demo_data
```

---

### Issue 8: Static Files Not Loading

**Error:**
Static files (CSS/JS) not loading in production

**Solution:**
```bash
python manage.py collectstatic --noinput
```

Make sure `STATIC_ROOT` is set in settings.py (already configured).

---

### Issue 9: File Upload Fails

**Error:**
Upload returns 500 error

**Solution:**
1. Check `MEDIA_ROOT` directory exists:
```bash
mkdir media  # If it doesn't exist
```

2. Check file permissions (macOS/Linux):
```bash
chmod 755 media
```

3. Check file size limits in settings.py

---

### Issue 10: Authentication Token Invalid

**Error:**
```
{"detail": "Invalid token."}
```

**Solution:**
1. Login again to get a new token
2. Clear browser localStorage:
   - Open DevTools (F12)
   - Application tab → Local Storage
   - Clear all

3. Restart frontend

---

## Complete Reset

If all else fails, here's how to completely reset:

### Backend Reset
```bash
cd backend

# Windows
rmdir /s /q venv
del db.sqlite3
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py setup_demo_data

# macOS/Linux
rm -rf venv
rm db.sqlite3
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py setup_demo_data
```

### Frontend Reset
```bash
cd frontend

# Windows
rmdir /s /q node_modules
del package-lock.json
npm install

# macOS/Linux
rm -rf node_modules package-lock.json
npm install
```

---

## Getting More Help

1. **Check Logs:**
   - Backend: Terminal where `runserver` is running
   - Frontend: Browser console (F12)

2. **Enable Debug Mode:**
   - Set `DEBUG=True` in backend `.env`
   - Check detailed error pages

3. **Check Documentation:**
   - [SETUP.md](SETUP.md) - Setup instructions
   - [API.md](API.md) - API documentation
   - [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick commands

4. **Common Commands:**
```bash
# Backend
python manage.py shell          # Django shell
python manage.py dbshell        # Database shell
python manage.py showmigrations # Show migration status

# Frontend
npm run build                   # Test production build
npm test                        # Run tests
```

---

## Prevention Tips

1. **Always activate virtual environment** before running Python commands
2. **Run migrations** before running the app after model changes
3. **Check .env files** are properly configured
4. **Keep dependencies updated** but test after updates
5. **Use version control** to track changes

---

## Still Having Issues?

If you're still experiencing problems:

1. Check the error message carefully
2. Search for the error online
3. Review Django/React documentation
4. Check if it's a known issue in the project
5. Create a detailed bug report with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Python version, Node version)
   - What you've already tried
