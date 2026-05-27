# Design Decisions and Rationale

## Architecture Decisions

### 1. Django REST Framework + React
**Decision**: Use Django REST Framework for backend and React for frontend.

**Rationale**:
- Django provides robust ORM, admin interface, and authentication out of the box
- DRF offers excellent API development tools with serializers and viewsets
- React provides a modern, component-based UI framework
- Clear separation of concerns between backend and frontend
- Easy to deploy separately (backend on Render, frontend on Vercel/Netlify)

### 2. Token-Based Authentication
**Decision**: Use DRF's token authentication instead of JWT or session-based auth.

**Rationale**:
- Simple to implement and understand
- Sufficient for the demo requirements
- No need for complex token refresh logic
- Works well with both web and potential mobile clients

### 3. Synchronous Processing
**Decision**: Process uploads synchronously in the initial version.

**Rationale**:
- Simpler implementation for demo
- Easier to debug and test
- For production, would recommend Celery for async processing
- Current approach works well for moderate file sizes

### 4. SQLite for Development, PostgreSQL for Production
**Decision**: Use SQLite locally, PostgreSQL in production.

**Rationale**:
- SQLite requires no setup for local development
- PostgreSQL provides better performance and features for production
- Easy to switch using dj-database-url
- Both supported by Django ORM

## Data Model Decisions

### 1. Normalized Single Table for Emissions
**Decision**: Store all emission types in one EmissionRecord table.

**Rationale**:
- Easier to query across all emission types
- Consistent structure for reporting
- Metadata JSON field handles source-specific variations
- Simpler than multiple tables per source type

### 2. Separate RawDataUpload Tracking
**Decision**: Keep raw uploads separate from normalized records.

**Rationale**:
- Maintains audit trail of original data
- Allows reprocessing if normalization logic changes
- Tracks upload status independently
- Useful for debugging data issues

### 3. Comprehensive Audit Logging
**Decision**: Log all changes to emission records in AuditLog table.

**Rationale**:
- Compliance requirement for emissions reporting
- Helps track who approved/rejected records
- Useful for debugging data issues
- Provides accountability

### 4. Multi-Tenancy via Organization
**Decision**: Use organization foreign key for multi-tenancy.

**Rationale**:
- Simple and effective for B2B SaaS
- Easy to filter queries by organization
- Supports future growth to multiple clients
- Clear data separation

## API Design Decisions

### 1. RESTful API with ViewSets
**Decision**: Use DRF ViewSets for CRUD operations.

**Rationale**:
- Follows REST conventions
- Automatic URL routing
- Built-in pagination and filtering
- Easy to extend with custom actions

### 2. Server-Side Pagination
**Decision**: Implement server-side pagination for all list endpoints.

**Rationale**:
- Better performance with large datasets
- Reduces payload size
- Standard practice for production APIs
- Configurable page size

### 3. Custom Review Endpoint
**Decision**: Create dedicated `/review/` endpoint for approval workflow.

**Rationale**:
- Clearer intent than generic PATCH
- Encapsulates review logic
- Easier to add validation rules
- Better for audit logging

## Frontend Decisions

### 1. Material-UI Component Library
**Decision**: Use Material-UI (MUI) for UI components.

**Rationale**:
- Professional, consistent design
- Comprehensive component library
- Good documentation and community
- Built-in accessibility features
- DataGrid component perfect for tables

### 2. Context API for Auth State
**Decision**: Use React Context for authentication state management.

**Rationale**:
- Built into React, no extra dependencies
- Sufficient for auth state needs
- Simpler than Redux for this use case
- Easy to understand and maintain

### 3. Axios for API Calls
**Decision**: Use Axios instead of fetch API.

**Rationale**:
- Better error handling
- Request/response interceptors for auth
- Automatic JSON transformation
- Better browser support

## Processing Logic Decisions

### 1. Rule-Based Source Categorization
**Decision**: Use keyword matching to categorize materials/utilities.

**Rationale**:
- Simple and transparent
- Easy to extend with new rules
- Works well for demo data
- For production, would use ML or lookup tables

### 2. Default Emission Factors
**Decision**: Use hardcoded default emission factors.

**Rationale**:
- Sufficient for demo
- Easy to understand calculations
- For production, would use database with regional factors
- Should be configurable per organization

### 3. Automatic Scope Assignment
**Decision**: Automatically assign scope based on category.

**Rationale**:
- Reduces manual data entry
- Follows GHG Protocol standards
- Can be overridden if needed
- Consistent categorization

## Security Decisions

### 1. CORS Configuration
**Decision**: Configure CORS to allow frontend origin.

**Rationale**:
- Required for separate frontend/backend
- Configurable via environment variables
- Restricts access to known origins
- Allows credentials for auth

### 2. Authentication Required by Default
**Decision**: Require authentication for all API endpoints except login.

**Rationale**:
- Secure by default
- Prevents unauthorized access
- Standard practice for business applications
- Easy to add public endpoints if needed

## Deployment Decisions

### 1. Separate Backend/Frontend Deployment
**Decision**: Deploy backend and frontend separately.

**Rationale**:
- Independent scaling
- Easier to update each part
- Better for CDN usage (frontend)
- Standard modern architecture

### 2. Environment Variables for Configuration
**Decision**: Use environment variables for all configuration.

**Rationale**:
- 12-factor app methodology
- Easy to change per environment
- Keeps secrets out of code
- Standard practice for cloud deployment

### 3. WhiteNoise for Static Files
**Decision**: Use WhiteNoise to serve static files from Django.

**Rationale**:
- Simple deployment
- No need for separate static file server
- Good performance for small apps
- Works well with Render/Heroku
