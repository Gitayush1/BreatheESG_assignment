# Data Model Documentation

## Overview

The BreatheESG platform uses a normalized data model designed to handle emissions data from multiple sources while maintaining data integrity and audit trails.

## Core Models

### Organization
Multi-tenancy support for different organizations using the platform.

**Fields:**
- `name`: Organization name
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### DataSource
Represents different data sources (SAP, Utility, Corporate Travel).

**Fields:**
- `organization`: Foreign key to Organization
- `name`: Data source name
- `source_type`: Type of source (SAP, UTILITY, CORPORATE_TRAVEL)
- `description`: Optional description
- `is_active`: Boolean flag for active sources
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### EmissionRecord
The normalized emission records - the source of truth for all emissions data.

**Fields:**
- `organization`: Foreign key to Organization
- `data_source`: Foreign key to DataSource
- `activity_date`: Date of the emission activity
- `scope`: Emission scope (SCOPE_1, SCOPE_2, SCOPE_3)
- `category`: Category of emission (e.g., "Electricity", "Natural Gas", "Air Travel")
- `activity_type`: Type of activity (e.g., "Consumption", "Distance Traveled")
- `quantity`: Numeric quantity of activity
- `unit`: Unit of measurement (e.g., "kWh", "km", "liters")
- `co2_emissions_kg`: Calculated CO2 emissions in kilograms
- `emission_factor`: Emission factor used for calculation
- `emission_factor_source`: Source of the emission factor
- `facility`: Facility identifier
- `location`: Location information
- `country`: Country code
- `status`: Review status (PENDING, APPROVED, REJECTED)
- `reviewed_by`: Foreign key to User who reviewed
- `reviewed_at`: Timestamp of review
- `review_notes`: Notes from reviewer
- `created_by`: Foreign key to User who created
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update
- `metadata`: JSON field for source-specific data

### RawDataUpload
Tracks raw data file uploads before normalization.

**Fields:**
- `organization`: Foreign key to Organization
- `data_source`: Foreign key to DataSource
- `file`: Uploaded file
- `original_filename`: Original filename
- `status`: Processing status (UPLOADED, PROCESSING, COMPLETED, FAILED)
- `records_processed`: Count of records processed
- `records_created`: Count of records successfully created
- `records_failed`: Count of records that failed
- `error_log`: Error messages
- `uploaded_by`: Foreign key to User
- `uploaded_at`: Timestamp of upload
- `processed_at`: Timestamp of processing completion

### AuditLog
Audit trail for all changes to emission records.

**Fields:**
- `emission_record`: Foreign key to EmissionRecord
- `action`: Type of action (CREATE, UPDATE, DELETE, APPROVE, REJECT)
- `user`: Foreign key to User who performed action
- `timestamp`: Timestamp of action
- `changes`: JSON field storing what changed
- `notes`: Additional notes

## Scope Classification

### Scope 1 - Direct Emissions
- Natural gas consumption
- Diesel fuel
- Gasoline
- Other direct fuel combustion

### Scope 2 - Indirect Emissions (Energy)
- Purchased electricity
- Purchased heating/cooling

### Scope 3 - Other Indirect Emissions
- Business travel (air, ground)
- Employee commuting
- Upstream/downstream transportation

## Emission Factors

Default emission factors used in the system (kg CO2 per unit):

- Electricity: 0.385 kg CO2/kWh (grid average)
- Natural Gas: 2.0 kg CO2/m³
- Diesel: 2.68 kg CO2/liter
- Gasoline: 2.31 kg CO2/liter
- Air Travel: 0.255 kg CO2/km (average)
- Car Travel: 0.192 kg CO2/km

These factors can be customized per organization and should be updated based on regional grids and latest IPCC guidelines.

## Data Flow

1. **Upload**: Raw data files uploaded via API
2. **Ingestion**: Files parsed and validated
3. **Normalization**: Data transformed to standard format
4. **Calculation**: Emissions calculated using factors
5. **Review**: Analysts review and approve/reject
6. **Audit**: All changes logged for compliance
