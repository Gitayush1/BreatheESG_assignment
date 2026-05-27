# Deployment Guide

## Overview

This guide covers deploying the BreatheESG platform to production using:
- **Backend**: Render (with PostgreSQL)
- **Frontend**: Vercel or Netlify

---

## Backend Deployment (Render)

### Prerequisites
- Render account (free tier available)
- GitHub repository with your code

### Step 1: Prepare Backend for Deployment

#### 1.1 Update requirements.txt
Ensure `psycopg2-binary` is included for PostgreSQL support.

#### 1.2 Create Render Configuration
Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: breathe-esg-backend
    env: python
    buildCommand: "pip install -r backend/requirements.txt && cd backend && python manage.py collectstatic --noinput && python manage.py migrate"
    startCommand: "cd backend && gunicorn breathe_esg.wsgi:application"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: False
      - key: ALLOWED_HOSTS
        sync: false
      - key: DATABASE_URL
        fromDatabase:
          name: breathe-esg-db
          property: connectionString
      - key: CORS_ALLOWED_ORIGINS
        sync: false

databases:
  - name: breathe-esg-db
    databaseName: breathe_esg
    user: breathe_esg_user
```

### Step 2: Deploy to Render

#### 2.1 Create New Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository

#### 2.2 Configure Service
- **Name**: breathe-esg-backend
- **Environment**: Python 3
- **Build Command**: 
  ```bash
  pip install -r backend/requirements.txt && cd backend && python manage.py collectstatic --noinput
  ```
- **Start Command**: 
  ```bash
  cd backend && gunicorn breathe_esg.wsgi:application
  ```

#### 2.3 Add Environment Variables
- `SECRET_KEY`: Generate a secure key
- `DEBUG`: False
- `ALLOWED_HOSTS`: your-app.onrender.com
- `CORS_ALLOWED_ORIGINS`: https://your-frontend.vercel.app
- `DATABASE_URL`: (auto-populated from PostgreSQL)

#### 2.4 Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: breathe-esg-db
3. Link to web service

#### 2.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the URL: `https://your-app.onrender.com`

### Step 3: Initialize Database

#### 3.1 Run Migrations
In Render dashboard:
1. Go to your web service
2. Click "Shell"
3. Run:
```bash
cd backend
python manage.py migrate
python manage.py setup_demo_data
```

Or use Render's one-off jobs feature.

### Step 4: Test Backend
```bash
curl https://your-app.onrender.com/api/auth/login/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"analyst@breatheesg.com","password":"demo2026"}'
```

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository

### Step 1: Prepare Frontend

#### 1.1 Update Environment Variables
Create `.env.production`:
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

#### 1.2 Test Production Build
```bash
cd frontend
npm run build
```

### Step 2: Deploy to Vercel

#### 2.1 Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

#### 2.2 Deploy via Web Interface
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: npm run build
   - **Output Directory**: build

#### 2.3 Add Environment Variables
- `REACT_APP_API_URL`: https://your-backend.onrender.com/api

#### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment
3. Note the URL: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

Update backend environment variable on Render:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

Redeploy backend for changes to take effect.

---

## Alternative: Frontend Deployment (Netlify)

### Step 1: Prepare Frontend
Same as Vercel preparation.

### Step 2: Deploy to Netlify

#### 2.1 Via Web Interface
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - **Base directory**: frontend
   - **Build command**: npm run build
   - **Publish directory**: frontend/build

#### 2.2 Add Environment Variables
- `REACT_APP_API_URL`: https://your-backend.onrender.com/api

#### 2.3 Deploy
1. Click "Deploy site"
2. Wait for deployment
3. Note the URL: `https://your-app.netlify.app`

---

## Post-Deployment Configuration

### 1. Update README.md
Add your deployment URLs:
```markdown
## Live Deployment

**Frontend**: https://your-app.vercel.app
**Backend API**: https://your-backend.onrender.com/api
```

### 2. Test Full Application
1. Visit frontend URL
2. Login with demo credentials
3. Upload sample data
4. Review and approve records
5. Check dashboard statistics

### 3. Monitor Application

#### Render Monitoring
- View logs in Render dashboard
- Set up alerts for errors
- Monitor database usage

#### Vercel/Netlify Monitoring
- View deployment logs
- Monitor bandwidth usage
- Check build times

---

## Production Checklist

### Security
- [ ] DEBUG=False in production
- [ ] Strong SECRET_KEY generated
- [ ] ALLOWED_HOSTS configured
- [ ] CORS_ALLOWED_ORIGINS restricted
- [ ] Database credentials secure
- [ ] HTTPS enabled (automatic on Render/Vercel)

### Performance
- [ ] Static files collected and served
- [ ] Database indexes created
- [ ] Gzip compression enabled
- [ ] CDN configured (Vercel/Netlify automatic)

### Functionality
- [ ] Database migrations run
- [ ] Demo data created
- [ ] File uploads working
- [ ] Email notifications configured (if added)
- [ ] Backup strategy in place

### Monitoring
- [ ] Error tracking configured
- [ ] Uptime monitoring enabled
- [ ] Log aggregation set up
- [ ] Performance monitoring active

---

## Scaling Considerations

### When to Scale

#### Backend
- Response time > 2 seconds
- CPU usage > 80%
- Memory usage > 80%
- Database connections maxed out

#### Frontend
- Build times > 5 minutes
- Bandwidth limits reached
- CDN cache hit rate < 80%

### Scaling Options

#### Backend (Render)
1. **Vertical Scaling**: Upgrade to larger instance
2. **Horizontal Scaling**: Add more instances (paid plans)
3. **Database Scaling**: Upgrade PostgreSQL plan
4. **Caching**: Add Redis for session/query caching

#### Frontend (Vercel/Netlify)
1. **CDN**: Already included, automatic
2. **Build Optimization**: Code splitting, lazy loading
3. **Image Optimization**: Use Vercel Image Optimization

---

## Backup and Recovery

### Database Backup (Render)

#### Automatic Backups
- Enabled on paid PostgreSQL plans
- Daily backups retained for 7 days

#### Manual Backup
```bash
# From Render shell
pg_dump $DATABASE_URL > backup.sql

# Download backup
# Use Render's download feature or upload to S3
```

### Application Backup

#### Code
- Stored in GitHub (version controlled)
- Tag releases for easy rollback

#### Media Files
- Store in S3 or similar (not included in basic setup)
- Configure Django storage backend

---

## Troubleshooting

### Backend Issues

#### 500 Internal Server Error
- Check Render logs
- Verify environment variables
- Check database connection
- Review Django error logs

#### Static Files Not Loading
```bash
# Run collectstatic
python manage.py collectstatic --noinput
```

#### Database Connection Failed
- Verify DATABASE_URL
- Check PostgreSQL status
- Ensure database is linked to service

### Frontend Issues

#### API Calls Failing
- Check REACT_APP_API_URL
- Verify CORS settings on backend
- Check network tab in browser DevTools

#### Build Failures
- Check Node.js version
- Clear cache and rebuild
- Review build logs

#### Environment Variables Not Working
- Ensure variables start with REACT_APP_
- Rebuild after adding variables
- Check Vercel/Netlify dashboard

---

## Cost Estimates

### Free Tier Limits

#### Render
- 750 hours/month web service
- 90 days PostgreSQL retention
- 100 GB bandwidth
- Sleeps after 15 min inactivity

#### Vercel
- 100 GB bandwidth
- 6000 build minutes
- Unlimited deployments

#### Netlify
- 100 GB bandwidth
- 300 build minutes
- Unlimited sites

### Paid Plans (Approximate)

#### Render
- Starter: $7/month (web service)
- PostgreSQL: $7/month (1 GB)

#### Vercel
- Pro: $20/month per user

#### Netlify
- Pro: $19/month per user

---

## Maintenance

### Regular Tasks

#### Weekly
- Review error logs
- Check disk usage
- Monitor response times

#### Monthly
- Update dependencies
- Review security advisories
- Backup database
- Review usage metrics

#### Quarterly
- Update Django/React versions
- Review and update emission factors
- Performance optimization
- Security audit

---

## Support and Resources

### Documentation
- Django: https://docs.djangoproject.com
- React: https://react.dev
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com

### Community
- Django Forum: https://forum.djangoproject.com
- React Community: https://react.dev/community
- Stack Overflow: Tag questions appropriately

### Professional Support
- Consider paid support plans for production
- Hire Django/React consultants for custom features
- Use managed services for critical infrastructure
