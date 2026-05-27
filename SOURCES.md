# Source Format Research

## Overview

This document describes the expected data formats for each source type supported by the BreatheESG platform.

## Source Types

### 1. SAP ERP System

**Description**: Enterprise Resource Planning system data, typically containing procurement and consumption records.

**Expected Format**: CSV or Excel

**Required Columns**:
- `Date`: Date of the transaction (YYYY-MM-DD or DD/MM/YYYY)
- `Material`: Material description (e.g., "Electricity Grid Power", "Natural Gas", "Diesel Fuel")
- `Quantity`: Numeric quantity consumed
- `Unit`: Unit of measurement (e.g., "kWh", "m3", "liters")
- `Plant`: Plant or facility identifier
- `Cost_Center`: Cost center code

**Sample Data**:
```csv
Date,Material,Quantity,Unit,Plant,Cost_Center
2026-01-15,Electricity Grid Power,15000,kWh,Plant-001,CC-100
2026-01-15,Natural Gas,500,m3,Plant-001,CC-100
2026-01-20,Diesel Fuel,200,liters,Plant-002,CC-200
```

**Categorization Logic**:
- Materials containing "electric" or "power" → Scope 2, Electricity
- Materials containing "gas" → Scope 1, Natural Gas
- Materials containing "diesel" → Scope 1, Diesel
- Materials containing "gasoline" or "petrol" → Scope 1, Gasoline

**Notes**:
- SAP exports may include additional columns (ignored by system)
- Material descriptions should be consistent for accurate categorization
- Dates can be in various formats (auto-detected)

---

### 2. Utility Billing System

**Description**: Utility company billing data for electricity, gas, water, etc.

**Expected Format**: CSV or Excel

**Required Columns**:
- `Invoice_Date`: Date of the invoice (YYYY-MM-DD or DD/MM/YYYY)
- `Utility_Type`: Type of utility (e.g., "Electricity", "Natural Gas", "Water")
- `Usage`: Numeric usage amount
- `Unit`: Unit of measurement (e.g., "kWh", "m3", "gallons")
- `Meter_ID`: Meter identifier
- `Location`: Location or building name

**Sample Data**:
```csv
Invoice_Date,Utility_Type,Usage,Unit,Meter_ID,Location
2026-01-31,Electricity,12000,kWh,MTR-001,Building A
2026-01-31,Natural Gas,400,m3,MTR-002,Building A
2026-02-28,Electricity,13500,kWh,MTR-001,Building A
```

**Categorization Logic**:
- Utility type containing "electric" → Scope 2, Electricity
- Utility type containing "gas" → Scope 1, Natural Gas
- Other utilities → Scope 2, Other Utility

**Notes**:
- Monthly billing cycles typical
- May include demand charges (not currently processed)
- Multiple meters per location supported

---

### 3. Corporate Travel Portal

**Description**: Employee travel and transportation data from travel booking systems.

**Expected Format**: CSV or Excel

**Required Columns**:
- `Travel_Date`: Date of travel (YYYY-MM-DD or DD/MM/YYYY)
- `Travel_Type`: Type of travel (e.g., "Air Travel", "Car Travel", "Train")
- `Distance`: Distance traveled
- `Unit`: Unit of distance (e.g., "km", "miles")
- `Origin`: Starting location
- `Destination`: Ending location
- `Employee_ID`: Employee identifier

**Sample Data**:
```csv
Travel_Date,Travel_Type,Distance,Unit,Origin,Destination,Employee_ID
2026-01-10,Air Travel,5000,km,New York,London,EMP-001
2026-01-15,Car Travel,150,km,Office,Client Site,EMP-002
2026-02-05,Air Travel,8000,km,San Francisco,Tokyo,EMP-003
```

**Categorization Logic**:
- Travel type containing "air" or "flight" → Scope 3, Air Travel
- Travel type containing "car" or "vehicle" → Scope 3, Ground Travel
- Other travel types → Scope 3, Other Travel

**Notes**:
- All travel is categorized as Scope 3
- Distance can be in km or miles (auto-converted)
- Round trips should be recorded as single entries with total distance

---

## Emission Factors

### Default Factors Used

| Category | Factor | Unit | Source |
|----------|--------|------|--------|
| Electricity | 0.385 | kg CO2/kWh | Grid average (US EPA) |
| Natural Gas | 2.0 | kg CO2/m³ | IPCC Guidelines |
| Diesel | 2.68 | kg CO2/liter | IPCC Guidelines |
| Gasoline | 2.31 | kg CO2/liter | IPCC Guidelines |
| Air Travel | 0.255 | kg CO2/km | DEFRA 2023 |
| Car Travel | 0.192 | kg CO2/km | DEFRA 2023 |

### Regional Variations

**Note**: Current implementation uses global averages. For production use, emission factors should be:
- Region-specific (especially for electricity grids)
- Updated annually
- Sourced from recognized authorities (EPA, IPCC, DEFRA)
- Configurable per organization

---

## Data Quality Requirements

### Mandatory Fields
All required columns must be present and non-empty for successful processing.

### Date Formats
Supported date formats:
- ISO 8601: `YYYY-MM-DD`
- US format: `MM/DD/YYYY`
- European format: `DD/MM/YYYY`
- Excel date serial numbers

### Numeric Values
- Must be positive numbers
- Decimal separators: `.` or `,`
- Thousand separators: `,` or ` ` (ignored)

### Units
Common unit variations are recognized:
- kWh, kilowatt-hour, kilowatt hour
- m3, m³, cubic meter
- km, kilometer, kilometres
- miles, mi

---

## File Format Requirements

### CSV Files
- UTF-8 encoding preferred
- Comma or semicolon delimiters
- Optional header row (recommended)
- Maximum file size: 50 MB

### Excel Files
- .xlsx or .xls format
- Data in first sheet
- Header row in first row
- Maximum file size: 50 MB

---

## Error Handling

### Common Errors

1. **Missing Required Columns**
   - Error: "Missing required column: [column_name]"
   - Solution: Ensure all required columns are present

2. **Invalid Date Format**
   - Error: "Invalid date format in row [X]"
   - Solution: Use supported date formats

3. **Non-Numeric Values**
   - Error: "Invalid numeric value in row [X]"
   - Solution: Ensure quantity fields contain only numbers

4. **Unknown Material/Utility Type**
   - Warning: Categorized as "Other" with default factor
   - Solution: Update categorization rules or use standard names

### Partial Success
- System processes all valid rows
- Invalid rows logged in error report
- Upload marked as "COMPLETED" with error count

---

## Future Enhancements

### Planned Additions
1. **Custom Column Mapping**: UI to map source columns to system fields
2. **Template Download**: Pre-formatted templates for each source type
3. **Pre-Upload Validation**: Client-side validation before upload
4. **Custom Emission Factors**: Organization-specific factors
5. **Additional Source Types**: 
   - Waste management
   - Water consumption
   - Refrigerant leakage
   - Supply chain data

### Integration Possibilities
- Direct API integration with SAP
- Real-time utility data feeds
- Travel booking system webhooks
- IoT sensor data streams

---

## References

- **GHG Protocol**: Corporate Accounting and Reporting Standard
- **EPA**: Emission Factors for Greenhouse Gas Inventories
- **IPCC**: Guidelines for National Greenhouse Gas Inventories
- **DEFRA**: UK Government GHG Conversion Factors
- **ISO 14064**: Greenhouse gases specification and guidance
