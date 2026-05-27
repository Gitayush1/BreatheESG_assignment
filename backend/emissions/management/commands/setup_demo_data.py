from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from emissions.models import Organization, DataSource


class Command(BaseCommand):
    help = 'Setup demo data for BreatheESG platform'

    def handle(self, *args, **options):
        self.stdout.write('Setting up demo data...')
        
        # Create demo user
        user, created = User.objects.get_or_create(
            username='analyst@breatheesg.com',
            defaults={
                'email': 'analyst@breatheesg.com',
                'first_name': 'Demo',
                'last_name': 'Analyst',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            user.set_password('demo2026')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))
        else:
            self.stdout.write(self.style.WARNING(f'User already exists: {user.username}'))
        
        # Create demo organization
        org, created = Organization.objects.get_or_create(
            name='Demo Corporation',
            defaults={}
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created organization: {org.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Organization already exists: {org.name}'))
        
        # Create data sources
        sources = [
            {'name': 'SAP ERP System', 'source_type': 'SAP', 'description': 'Primary ERP system for procurement data'},
            {'name': 'Utility Billing System', 'source_type': 'UTILITY', 'description': 'Electricity and gas consumption data'},
            {'name': 'Corporate Travel Portal', 'source_type': 'CORPORATE_TRAVEL', 'description': 'Employee travel and transportation data'},
        ]
        
        for source_data in sources:
            source, created = DataSource.objects.get_or_create(
                organization=org,
                name=source_data['name'],
                defaults={
                    'source_type': source_data['source_type'],
                    'description': source_data['description']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created data source: {source.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Data source already exists: {source.name}'))
        
        self.stdout.write(self.style.SUCCESS('\nDemo data setup complete!'))
        self.stdout.write(self.style.SUCCESS('\nLogin credentials:'))
        self.stdout.write(f'  Username: analyst@breatheesg.com')
        self.stdout.write(f'  Password: demo2026')
