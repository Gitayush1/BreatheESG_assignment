# BreatheESG Data Ingestion Platform

A Django REST API and React application for ingesting, normalizing, and reviewing emissions data from multiple sources.

## 🌍 Overview

BreatheESG is a comprehensive platform for managing greenhouse gas emissions data. It automates the ingestion of data from multiple sources (SAP, utility bills, corporate travel), normalizes it into a consistent format, and provides an analyst dashboard for review and approval.

## 🚀 Live Deployment

**URL**: [To be added after deployment]

## 🔐 Login Credentials

- **Username**: analyst@breatheesg.com
- **Password**: demo2026

## 📁 Project Structure

```
breathe-esg/
├── backend/                    # Django REST API
│   ├── breathe_esg/           # Django project settings
│   ├── emissions/             # Main application
│   │   ├── models.py          # Data models
│   │   ├── views.py           # API views
│   │   ├── serializers.py     # DRF serializers
│   │   ├── ingestion.py       # Data processing logic
│   │   └── management/        # Management commands
│   ├── sample_data/           # Sample CSV files
│   └── requirements.txt       # Python dependencies
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── context/           # React context
│   └── package.json           # Node dependencies
├── MODEL.md                    # Data model documentation
├── DECISIONS.md                # Design decisions and rationale
├── TRADEOFFS.md                # Deliberate omissions
├── SOURCES.md                  # Source format research
├── SETUP.md                    # Detailed setup guide
└── DEPLOYMENT.md               # Deployment instructions
```

## ⚡ Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip and npm

### Backend Setup

**Option 1: Automated Setup (Recommended)**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux

# Windows
setup.bat

# macOS/Linux
chmod +x setup.sh
./setup.sh
```

**Option 2: Manual Setup**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
python manage.py migrate       # IMPORTANT: Run this first!
python manage.py setup_demo_data
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

**Note:** If you encounter any issues, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend will run at: `http://localhost:3000`

### First Steps
1. Open `http://localhost:3000` in your browser
2. Login with: `analyst@breatheesg.com` / `demo2026`
3. Go to "Upload Data" and upload a sample file from `backend/sample_data/`
4. Review records in "Review Queue"
5. View statistics on "Dashboard"

## ✨ Features

### Core Functionality
- ✅ **Multi-Source Ingestion**: SAP, Utility Bills, Corporate Travel
- ✅ **Automated Normalization**: Converts diverse formats to standard schema
- ✅ **Emissions Calculation**: Automatic CO2 calculation using emission factors
- ✅ **Scope Categorization**: Automatic Scope 1/2/3 classification
- ✅ **Review Workflow**: Analyst approval/rejection with notes
- ✅ **Audit Trail**: Complete history of all changes
- ✅ **Multi-Tenancy**: Organization-based data separation

### User Interface
- 📊 **Dashboard**: Real-time statistics and emissions breakdown
- 📋 **Emission Records**: Searchable, filterable data grid
- 📤 **Data Upload**: Drag-and-drop file upload with progress tracking
- ✅ **Review Queue**: Streamlined approval workflow
- 🎨 **Modern UI**: Material-UI components with responsive design

### API Features
- 🔒 **Token Authentication**: Secure API access
- 📄 **RESTful Endpoints**: Standard CRUD operations
- 🔍 **Filtering & Search**: Advanced query capabilities
- 📊 **Statistics Endpoint**: Aggregated emissions data
- 📝 **Comprehensive Serialization**: Nested data relationships

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.0
- **API**: Django REST Framework 3.15
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Data Processing**: Pandas, OpenPyXL
- **Server**: Gunicorn + WhiteNoise

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI) 5
- **Data Grid**: MUI X DataGrid
- **HTTP Client**: Axios
- **Routing**: React Router 6

### Deployment
- **Backend**: Render (with PostgreSQL)
- **Frontend**: Vercel or Netlify
- **CI/CD**: GitHub Actions (optional)

## 📖 Documentation

- **[SETUP.md](SETUP.md)**: Detailed setup instructions
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Production deployment guide
- **[MODEL.md](MODEL.md)**: Data model and database schema
- **[DECISIONS.md](DECISIONS.md)**: Architecture and design decisions
- **[TRADEOFFS.md](TRADEOFFS.md)**: What's included and what's not
- **[SOURCES.md](SOURCES.md)**: Data source formats and requirements

## 🎯 Use Cases

1. **Corporate Sustainability Teams**: Track and report emissions across facilities
2. **ESG Analysts**: Review and validate emissions data for reporting
3. **Compliance Officers**: Maintain audit trail for regulatory compliance
4. **Data Teams**: Integrate emissions data from multiple systems

## 🔄 Data Flow

```
1. Upload → 2. Parse → 3. Normalize → 4. Calculate → 5. Review → 6. Approve
   ↓           ↓           ↓             ↓            ↓           ↓
  CSV/Excel  Pandas    EmissionRecord  CO2 Factor  Analyst   Source of Truth
```

## 📊 Sample Data

Sample files are provided in `backend/sample_data/`:
- `sap_sample.csv`: SAP procurement data
- `utility_sample.csv`: Utility billing data
- `travel_sample.csv`: Corporate travel data

## 🔐 Security Features

- Token-based authentication
- CORS protection
- CSRF protection
- SQL injection prevention (Django ORM)
- Input validation and sanitization

## 🚀 Deployment

### Quick Deploy to Render + Vercel

1. **Backend (Render)**:
   - Connect GitHub repository
   - Add PostgreSQL database
   - Set environment variables
   - Deploy

2. **Frontend (Vercel)**:
   - Connect GitHub repository
   - Set `REACT_APP_API_URL`
   - Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm test
```

## 📈 Future Enhancements

- [ ] Asynchronous task processing (Celery)
- [ ] Advanced analytics and reporting
- [ ] Custom emission factors per organization
- [ ] Bulk operations (approve/reject multiple)
- [ ] Export to Excel/PDF
- [ ] Role-based access control
- [ ] Email notifications
- [ ] API rate limiting
- [ ] Comprehensive test coverage

See [TRADEOFFS.md](TRADEOFFS.md) for complete list.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is provided as-is for demonstration purposes.

## 🆘 Support

For issues and questions:
- Check [SETUP.md](SETUP.md) for setup help
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- Open an issue on GitHub

## 👥 Authors

Built as a demonstration of modern web application development with Django and React.

## 🙏 Acknowledgments

- GHG Protocol for emissions categorization standards
- EPA, IPCC, DEFRA for emission factors
- Django and React communities for excellent documentation
