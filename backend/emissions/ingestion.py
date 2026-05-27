"""
Data ingestion and normalization service for different source formats
"""
import pandas as pd
from datetime import datetime
from decimal import Decimal
from .models import EmissionRecord, RawDataUpload, DataSource, AuditLog


class DataIngestionService:
    """Service to handle data ingestion from various sources"""
    
    # Emission factors (kg CO2 per unit)
    EMISSION_FACTORS = {
        'electricity_kwh': 0.385,  # kg CO2 per kWh (grid average)
        'natural_gas_m3': 2.0,     # kg CO2 per m3
        'diesel_liters': 2.68,     # kg CO2 per liter
        'gasoline_liters': 2.31,   # kg CO2 per liter
        'air_travel_km': 0.255,    # kg CO2 per km (average)
        'car_travel_km': 0.192,    # kg CO2 per km
    }
    
    def __init__(self, upload: RawDataUpload, user):
        self.upload = upload
        self.user = user
        self.errors = []
        
    def process_upload(self):
        """Main entry point for processing uploads"""
        try:
            self.upload.status = 'PROCESSING'
            self.upload.save()
            
            # Read file based on extension
            file_path = self.upload.file.path
            if file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
            elif file_path.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(file_path)
            else:
                raise ValueError("Unsupported file format")
            
            # Process based on source type
            source_type = self.upload.data_source.source_type
            if source_type == 'SAP':
                records = self._process_sap_data(df)
            elif source_type == 'UTILITY':
                records = self._process_utility_data(df)
            elif source_type == 'CORPORATE_TRAVEL':
                records = self._process_travel_data(df)
            else:
                raise ValueError(f"Unknown source type: {source_type}")
            
            # Save records
            created_count = 0
            for record_data in records:
                try:
                    record = EmissionRecord.objects.create(**record_data)
                    AuditLog.objects.create(
                        emission_record=record,
                        action='CREATE',
                        user=self.user,
                        notes=f"Created from upload: {self.upload.original_filename}"
                    )
                    created_count += 1
                except Exception as e:
                    self.errors.append(f"Error creating record: {str(e)}")
            
            # Update upload status
            self.upload.status = 'COMPLETED'
            self.upload.records_processed = len(records)
            self.upload.records_created = created_count
            self.upload.records_failed = len(records) - created_count
            self.upload.error_log = '\n'.join(self.errors)
            self.upload.processed_at = datetime.now()
            self.upload.save()
            
            return created_count, len(self.errors)
            
        except Exception as e:
            self.upload.status = 'FAILED'
            self.upload.error_log = str(e)
            self.upload.save()
            raise
    
    def _process_sap_data(self, df):
        """Process SAP format data"""
        records = []
        
        # Expected SAP columns: Date, Material, Quantity, Unit, Plant, Cost_Center
        for idx, row in df.iterrows():
            try:
                # Determine scope and category based on material
                material = str(row.get('Material', '')).lower()
                scope, category, emission_key = self._categorize_sap_material(material)
                
                quantity = float(row.get('Quantity', 0))
                unit = str(row.get('Unit', '')).lower()
                
                # Calculate emissions
                co2_emissions = self._calculate_emissions(emission_key, quantity, unit)
                
                record = {
                    'organization': self.upload.organization,
                    'data_source': self.upload.data_source,
                    'activity_date': pd.to_datetime(row.get('Date')).date(),
                    'scope': scope,
                    'category': category,
                    'activity_type': 'Consumption',
                    'quantity': Decimal(str(quantity)),
                    'unit': unit,
                    'co2_emissions_kg': Decimal(str(co2_emissions)),
                    'emission_factor': Decimal(str(self.EMISSION_FACTORS.get(emission_key, 0))),
                    'emission_factor_source': 'Default factors',
                    'facility': str(row.get('Plant', '')),
                    'location': str(row.get('Cost_Center', '')),
                    'status': 'PENDING',
                    'created_by': self.user,
                    'metadata': {
                        'material': str(row.get('Material', '')),
                        'source_row': idx + 2  # Excel row number
                    }
                }
                records.append(record)
            except Exception as e:
                self.errors.append(f"Row {idx + 2}: {str(e)}")
        
        return records
    
    def _process_utility_data(self, df):
        """Process Utility format data"""
        records = []
        
        # Expected columns: Invoice_Date, Utility_Type, Usage, Unit, Meter_ID, Location
        for idx, row in df.iterrows():
            try:
                utility_type = str(row.get('Utility_Type', '')).lower()
                scope, category, emission_key = self._categorize_utility(utility_type)
                
                quantity = float(row.get('Usage', 0))
                unit = str(row.get('Unit', '')).lower()
                
                co2_emissions = self._calculate_emissions(emission_key, quantity, unit)
                
                record = {
                    'organization': self.upload.organization,
                    'data_source': self.upload.data_source,
                    'activity_date': pd.to_datetime(row.get('Invoice_Date')).date(),
                    'scope': scope,
                    'category': category,
                    'activity_type': 'Consumption',
                    'quantity': Decimal(str(quantity)),
                    'unit': unit,
                    'co2_emissions_kg': Decimal(str(co2_emissions)),
                    'emission_factor': Decimal(str(self.EMISSION_FACTORS.get(emission_key, 0))),
                    'emission_factor_source': 'Default factors',
                    'facility': str(row.get('Meter_ID', '')),
                    'location': str(row.get('Location', '')),
                    'status': 'PENDING',
                    'created_by': self.user,
                    'metadata': {
                        'utility_type': str(row.get('Utility_Type', '')),
                        'source_row': idx + 2
                    }
                }
                records.append(record)
            except Exception as e:
                self.errors.append(f"Row {idx + 2}: {str(e)}")
        
        return records
    
    def _process_travel_data(self, df):
        """Process Corporate Travel format data"""
        records = []
        
        # Expected columns: Travel_Date, Travel_Type, Distance, Unit, Origin, Destination, Employee_ID
        for idx, row in df.iterrows():
            try:
                travel_type = str(row.get('Travel_Type', '')).lower()
                category, emission_key = self._categorize_travel(travel_type)
                
                quantity = float(row.get('Distance', 0))
                unit = str(row.get('Unit', 'km')).lower()
                
                co2_emissions = self._calculate_emissions(emission_key, quantity, unit)
                
                record = {
                    'organization': self.upload.organization,
                    'data_source': self.upload.data_source,
                    'activity_date': pd.to_datetime(row.get('Travel_Date')).date(),
                    'scope': 'SCOPE_3',  # All travel is Scope 3
                    'category': category,
                    'activity_type': 'Distance Traveled',
                    'quantity': Decimal(str(quantity)),
                    'unit': unit,
                    'co2_emissions_kg': Decimal(str(co2_emissions)),
                    'emission_factor': Decimal(str(self.EMISSION_FACTORS.get(emission_key, 0))),
                    'emission_factor_source': 'Default factors',
                    'location': f"{row.get('Origin', '')} to {row.get('Destination', '')}",
                    'status': 'PENDING',
                    'created_by': self.user,
                    'metadata': {
                        'travel_type': str(row.get('Travel_Type', '')),
                        'employee_id': str(row.get('Employee_ID', '')),
                        'origin': str(row.get('Origin', '')),
                        'destination': str(row.get('Destination', '')),
                        'source_row': idx + 2
                    }
                }
                records.append(record)
            except Exception as e:
                self.errors.append(f"Row {idx + 2}: {str(e)}")
        
        return records
    
    def _categorize_sap_material(self, material):
        """Categorize SAP material into scope and category"""
        if 'electric' in material or 'power' in material:
            return 'SCOPE_2', 'Electricity', 'electricity_kwh'
        elif 'gas' in material:
            return 'SCOPE_1', 'Natural Gas', 'natural_gas_m3'
        elif 'diesel' in material:
            return 'SCOPE_1', 'Diesel', 'diesel_liters'
        elif 'gasoline' in material or 'petrol' in material:
            return 'SCOPE_1', 'Gasoline', 'gasoline_liters'
        else:
            return 'SCOPE_1', 'Other Fuel', 'diesel_liters'
    
    def _categorize_utility(self, utility_type):
        """Categorize utility type into scope and category"""
        if 'electric' in utility_type:
            return 'SCOPE_2', 'Electricity', 'electricity_kwh'
        elif 'gas' in utility_type:
            return 'SCOPE_1', 'Natural Gas', 'natural_gas_m3'
        else:
            return 'SCOPE_2', 'Other Utility', 'electricity_kwh'
    
    def _categorize_travel(self, travel_type):
        """Categorize travel type"""
        if 'air' in travel_type or 'flight' in travel_type:
            return 'Air Travel', 'air_travel_km'
        elif 'car' in travel_type or 'vehicle' in travel_type:
            return 'Ground Travel', 'car_travel_km'
        else:
            return 'Other Travel', 'car_travel_km'
    
    def _calculate_emissions(self, emission_key, quantity, unit):
        """Calculate CO2 emissions based on quantity and emission factor"""
        factor = self.EMISSION_FACTORS.get(emission_key, 0)
        
        # Unit conversions if needed
        if unit in ['kwh', 'kilowatt-hour', 'kilowatt hour']:
            pass  # Already in correct unit
        elif unit in ['mwh', 'megawatt-hour']:
            quantity *= 1000
        elif unit in ['km', 'kilometer', 'kilometres']:
            pass
        elif unit in ['miles', 'mi']:
            quantity *= 1.60934  # Convert to km
        
        return quantity * factor
