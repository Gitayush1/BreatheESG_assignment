# Quick Reference Guide

## 🚀 Quick Commands

### Backend

```bash
# Setup
cd backend
python -m venv venv
venv\Scripts\activate              # Windows
source venv/bin/activate           # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py setup_demo_data

# Run
python manage.py runserver

# Other Commands
python manage.py createsuperuser   # Create admin user
python manage.py shell             # Django shell
python manage.py makemigrations    # Create migrations
python manage.py collectstatic     # Collect static files
```

### Frontend

```bash
# Setup
cd frontend
npm install

# Run
npm start

# Other Commands
npm run build                      # Production build
npm test                           # Run tests
```

---

## 🔐 Default Credentials

**Demo User:**
- Username: `analyst@breatheesg.com`
- Password: `demo2026`

**Admin User:** (create with `createsuperuser`)
- Username: (your choice)
- Password: (your choice)

---

## 🌐 URLs

**Development:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin: http://localhost:8000/admin

**Production:**
- Frontend: https://your-app.vercel.app
- Backend API: https://your-app.onrender.com/api

---

## 📁 Important Files

### Configuration
- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables
- `backend/breathe_esg/settings.py` - Django settings

### Sample Data
- `backend/sample_data/sap_sample.csv`
- `backend/sample_data/utility_sample.csv`
- `backend/sample_data/travel_sample.csv`

### Documentation
- `README.md` - Project overview
- `SETUP.md` - Setup instructions
- `DEPLOYMENT.md` - Deployment guide
- `API.md` - API documentation

---

## 🔧 Common Tasks

### Add New User
```bash
python manage.py createsuperuser
```

### Reset Database
```bash
# Delete database
rm db.sqlite3

# Recreate
python manage.py migrate
python manage.py setup_demo_data
```

### View Logs
```bash
# Backend: Check terminal where runserver is running
# Frontend: Check browser console (F12)
```

### Update Dependencies
```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
npm update
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000        # Windows
lsof -ti:8000                       # macOS/Linux

# Use different port
python manage.py runserver 8001
```

### Frontend Won't Start
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Use different port
# Edit package.json or set PORT=3001
```

### CORS Errors
1. Check `CORS_ALLOWED_ORIGINS` in backend `.env`
2. Check `REACT_APP_API_URL` in frontend `.env`
3. Restart both servers

### Database Errors
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
python manage.py setup_demo_data
```

---

## 📊 API Quick Reference

### Authentication
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"analyst@breatheesg.com","password":"demo2026"}'

# Use token in subsequent requests
curl http://localhost:8000/api/emission-records/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### Common Endpoints
- `GET /api/emission-records/` - List records
- `GET /api/emission-records/statistics/` - Get stats
- `POST /api/uploads/` - Upload file
- `POST /api/emission-records/{id}/review/` - Review record

---

## 🎨 UI Navigation

1. **Dashboard** - Overview and statistics
2. **Emission Records** - Browse all records
3. **Upload Data** - Upload new files
4. **Review Queue** - Approve/reject pending records

---

## 📝 File Upload Format

### SAP Format
```csv
Date,Material,Quantity,Unit,Plant,Cost_Center
2026-01-15,Electricity Grid Power,15000,kWh,Plant-001,CC-100
```

### Utility Format
```csv
Invoice_Date,Utility_Type,Usage,Unit,Meter_ID,Location
2026-01-31,Electricity,12000,kWh,MTR-001,Building A
```

### Travel Format
```csv
Travel_Date,Travel_Type,Distance,Unit,Origin,Destination,Employee_ID
2026-01-10,Air Travel,5000,km,New York,London,EMP-001
```

---

## 🔢 Emission Factors

| Type | Factor | Unit |
|------|--------|------|
| Electricity | 0.385 | kg CO2/kWh |
| Natural Gas | 2.0 | kg CO2/m³ |
| Diesel | 2.68 | kg CO2/liter |
| Gasoline | 2.31 | kg CO2/liter |
| Air Travel | 0.255 | kg CO2/km |
| Car Travel | 0.192 | kg CO2/km |

---

## 🎯 Scope Classification

- **Scope 1**: Direct emissions (gas, diesel, gasoline)
- **Scope 2**: Indirect energy (electricity)
- **Scope 3**: Other indirect (travel)

---

## 📦 Dependencies

### Backend (Python)
- Django 5.0
- djangorestframework 3.15
- pandas 2.2
- psycopg2-binary 2.9

### Frontend (Node)
- react 18.3
- @mui/material 5.15
- axios 1.6
- react-router-dom 6.22

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Update SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up PostgreSQL
- [ ] Update CORS_ALLOWED_ORIGINS

### Render (Backend)
- [ ] Create PostgreSQL database
- [ ] Create web service
- [ ] Set environment variables
- [ ] Deploy
- [ ] Run migrations

### Vercel (Frontend)
- [ ] Connect repository
- [ ] Set REACT_APP_API_URL
- [ ] Deploy

### Post-Deployment
- [ ] Test login
- [ ] Upload sample data
- [ ] Review records
- [ ] Check statistics

---

## 💡 Tips

### Development
- Use Django admin for quick data inspection
- Check browser Network tab for API issues
- Use React DevTools for component debugging
- Keep both servers running during development

### Production
- Always use PostgreSQL, not SQLite
- Enable HTTPS (automatic on Render/Vercel)
- Monitor logs regularly
- Set up database backups

### Performance
- Use pagination for large datasets
- Add database indexes for frequent queries
- Consider Redis for caching
- Use CDN for static files

---

## 📞 Getting Help

1. Check error message in terminal/console
2. Review relevant documentation file
3. Search error message online
4. Check Django/React documentation
5. Open GitHub issue

---

## 🔗 Useful Links

- Django Docs: https://docs.djangoproject.com
- DRF Docs: https://www.django-rest-framework.org
- React Docs: https://react.dev
- MUI Docs: https://mui.com
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

---

## ⌨️ Keyboard Shortcuts

### Browser
- `F12` - Open DevTools
- `Ctrl+Shift+R` - Hard refresh
- `Ctrl+Shift+I` - Inspect element

### VS Code
- `Ctrl+` ` - Toggle terminal
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+F` - Search in files

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🎓 Learning Resources

### Django
- Official Tutorial: https://docs.djangoproject.com/en/5.0/intro/tutorial01/
- DRF Tutorial: https://www.django-rest-framework.org/tutorial/quickstart/

### React
- Official Tutorial: https://react.dev/learn
- React Router: https://reactrouter.com/en/main

### Material-UI
- Getting Started: https://mui.com/material-ui/getting-started/

---

This quick reference should help you navigate the project efficiently!
