# API Documentation

## Base URL
```
Development: http://localhost:8000/api
Production: https://your-app.onrender.com/api
```

## Authentication

All endpoints except `/auth/login/` require authentication using Token authentication.

### Headers
```
Authorization: Token YOUR_TOKEN_HERE
Content-Type: application/json
```

---

## Authentication Endpoints

### Login
```http
POST /auth/login/
```

**Request Body:**
```json
{
  "username": "analyst@breatheesg.com",
  "password": "demo2026"
}
```

**Response:**
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": 1,
    "username": "analyst@breatheesg.com",
    "email": "analyst@breatheesg.com",
    "first_name": "Demo",
    "last_name": "Analyst"
  }
}
```

### Logout
```http
POST /auth/logout/
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### Get Current User
```http
GET /auth/me/
```

**Response:**
```json
{
  "id": 1,
  "username": "analyst@breatheesg.com",
  "email": "analyst@breatheesg.com",
  "first_name": "Demo",
  "last_name": "Analyst"
}
```

---

## Organizations

### List Organizations
```http
GET /organizations/
```

**Query Parameters:**
- `search`: Search by name
- `ordering`: Order by field (e.g., `name`, `-created_at`)

**Response:**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Demo Corporation",
      "created_at": "2026-05-25T10:00:00Z",
      "updated_at": "2026-05-25T10:00:00Z"
    }
  ]
}
```

### Create Organization
```http
POST /organizations/
```

**Request Body:**
```json
{
  "name": "New Corporation"
}
```

### Get Organization
```http
GET /organizations/{id}/
```

### Update Organization
```http
PUT /organizations/{id}/
PATCH /organizations/{id}/
```

### Delete Organization
```http
DELETE /organizations/{id}/
```

---

## Data Sources

### List Data Sources
```http
GET /data-sources/
```

**Query Parameters:**
- `organization`: Filter by organization ID
- `source_type`: Filter by type (SAP, UTILITY, CORPORATE_TRAVEL)
- `is_active`: Filter by active status (true/false)
- `search`: Search by name or description
- `ordering`: Order by field

**Response:**
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "organization": 1,
      "organization_name": "Demo Corporation",
      "name": "SAP ERP System",
      "source_type": "SAP",
      "description": "Primary ERP system for procurement data",
      "is_active": true,
      "created_at": "2026-05-25T10:00:00Z",
      "updated_at": "2026-05-25T10:00:00Z"
    }
  ]
}
```

### Create Data Source
```http
POST /data-sources/
```

**Request Body:**
```json
{
  "organization": 1,
  "name": "New Data Source",
  "source_type": "SAP",
  "description": "Description here",
  "is_active": true
}
```

---

## Emission Records

### List Emission Records
```http
GET /emission-records/
```

**Query Parameters:**
- `organization`: Filter by organization ID
- `data_source`: Filter by data source ID
- `scope`: Filter by scope (SCOPE_1, SCOPE_2, SCOPE_3)
- `status`: Filter by status (PENDING, APPROVED, REJECTED)
- `activity_date`: Filter by date
- `search`: Search by category, facility, location
- `ordering`: Order by field
- `page`: Page number
- `page_size`: Results per page (default: 50)

**Response:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/emission-records/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "organization": 1,
      "organization_name": "Demo Corporation",
      "data_source": 1,
      "data_source_name": "SAP ERP System",
      "activity_date": "2026-01-15",
      "scope": "SCOPE_2",
      "category": "Electricity",
      "activity_type": "Consumption",
      "quantity": "15000.0000",
      "unit": "kWh",
      "co2_emissions_kg": "5775.0000",
      "emission_factor": "0.385000",
      "emission_factor_source": "Default factors",
      "facility": "Plant-001",
      "location": "CC-100",
      "country": "",
      "status": "PENDING",
      "reviewed_by": null,
      "reviewed_by_name": null,
      "reviewed_at": null,
      "review_notes": "",
      "created_by": 1,
      "created_by_name": "analyst@breatheesg.com",
      "created_at": "2026-05-25T10:00:00Z",
      "updated_at": "2026-05-25T10:00:00Z",
      "metadata": {
        "material": "Electricity Grid Power",
        "source_row": 2
      }
    }
  ]
}
```

### Get Emission Record
```http
GET /emission-records/{id}/
```

### Create Emission Record
```http
POST /emission-records/
```

**Request Body:**
```json
{
  "organization": 1,
  "data_source": 1,
  "activity_date": "2026-05-25",
  "scope": "SCOPE_1",
  "category": "Natural Gas",
  "activity_type": "Consumption",
  "quantity": "500",
  "unit": "m3",
  "co2_emissions_kg": "1000",
  "emission_factor": "2.0",
  "emission_factor_source": "IPCC",
  "facility": "Building A",
  "location": "New York",
  "country": "US"
}
```

### Update Emission Record
```http
PUT /emission-records/{id}/
PATCH /emission-records/{id}/
```

### Delete Emission Record
```http
DELETE /emission-records/{id}/
```

### Review Emission Record
```http
POST /emission-records/{id}/review/
```

**Request Body:**
```json
{
  "status": "APPROVED",
  "review_notes": "Data verified and approved"
}
```

**Response:**
```json
{
  "id": 1,
  "status": "APPROVED",
  "reviewed_by": 1,
  "reviewed_by_name": "analyst@breatheesg.com",
  "reviewed_at": "2026-05-25T10:30:00Z",
  "review_notes": "Data verified and approved",
  ...
}
```

### Get Statistics
```http
GET /emission-records/statistics/
```

**Query Parameters:** (same as list endpoint for filtering)

**Response:**
```json
{
  "total_records": 100,
  "total_emissions_kg": 50000.5,
  "pending_review": 25,
  "by_scope": {
    "SCOPE_1": {
      "count": 30,
      "total_emissions_kg": 15000.0
    },
    "SCOPE_2": {
      "count": 40,
      "total_emissions_kg": 20000.0
    },
    "SCOPE_3": {
      "count": 30,
      "total_emissions_kg": 15000.5
    }
  },
  "by_status": {
    "PENDING": 25,
    "APPROVED": 70,
    "REJECTED": 5
  }
}
```

---

## Uploads

### List Uploads
```http
GET /uploads/
```

**Query Parameters:**
- `organization`: Filter by organization ID
- `data_source`: Filter by data source ID
- `status`: Filter by status (UPLOADED, PROCESSING, COMPLETED, FAILED)
- `ordering`: Order by field

**Response:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "organization": 1,
      "organization_name": "Demo Corporation",
      "data_source": 1,
      "data_source_name": "SAP ERP System",
      "file": "/media/uploads/2026/05/25/sap_sample.csv",
      "original_filename": "sap_sample.csv",
      "status": "COMPLETED",
      "records_processed": 10,
      "records_created": 10,
      "records_failed": 0,
      "error_log": "",
      "uploaded_by": 1,
      "uploaded_by_name": "analyst@breatheesg.com",
      "uploaded_at": "2026-05-25T10:00:00Z",
      "processed_at": "2026-05-25T10:00:05Z"
    }
  ]
}
```

### Create Upload
```http
POST /uploads/
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File to upload (CSV or Excel)
- `data_source`: Data source ID
- `organization`: Organization ID
- `original_filename`: Original filename

**Response:**
```json
{
  "id": 1,
  "status": "PROCESSING",
  "original_filename": "sap_sample.csv",
  ...
}
```

### Reprocess Upload
```http
POST /uploads/{id}/reprocess/
```

**Response:**
```json
{
  "message": "Upload reprocessed successfully",
  "records_created": 10,
  "errors": 0
}
```

---

## Audit Logs

### List Audit Logs
```http
GET /audit-logs/
```

**Query Parameters:**
- `emission_record`: Filter by emission record ID
- `action`: Filter by action (CREATE, UPDATE, DELETE, APPROVE, REJECT)
- `user`: Filter by user ID
- `ordering`: Order by field

**Response:**
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "emission_record": 1,
      "emission_record_summary": "2026-01-15 - Electricity",
      "action": "APPROVE",
      "user": 1,
      "user_name": "analyst@breatheesg.com",
      "timestamp": "2026-05-25T10:30:00Z",
      "changes": {},
      "notes": "Data verified and approved"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Rate Limiting

Currently not implemented. For production use, consider adding rate limiting.

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Results per page (default: 50, max: 100)

**Response Format:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Filtering

Most list endpoints support filtering via query parameters. See individual endpoint documentation for available filters.

---

## Ordering

Use the `ordering` query parameter to sort results:

```
?ordering=field_name          # Ascending
?ordering=-field_name         # Descending
?ordering=field1,-field2      # Multiple fields
```

---

## Examples

### Complete Workflow Example

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"analyst@breatheesg.com","password":"demo2026"}' \
  | jq -r '.token')

# 2. Get data sources
curl http://localhost:8000/api/data-sources/ \
  -H "Authorization: Token $TOKEN"

# 3. Upload file
curl -X POST http://localhost:8000/api/uploads/ \
  -H "Authorization: Token $TOKEN" \
  -F "file=@sap_sample.csv" \
  -F "data_source=1" \
  -F "organization=1" \
  -F "original_filename=sap_sample.csv"

# 4. Get pending records
curl http://localhost:8000/api/emission-records/?status=PENDING \
  -H "Authorization: Token $TOKEN"

# 5. Review a record
curl -X POST http://localhost:8000/api/emission-records/1/review/ \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"APPROVED","review_notes":"Looks good"}'

# 6. Get statistics
curl http://localhost:8000/api/emission-records/statistics/ \
  -H "Authorization: Token $TOKEN"
```
