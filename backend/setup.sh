#!/bin/bash

echo "========================================"
echo "BreatheESG Backend Setup"
echo "========================================"
echo ""

echo "Step 1: Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo ""

echo "Step 2: Running database migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to run migrations"
    exit 1
fi
echo ""

echo "Step 3: Setting up demo data..."
python manage.py setup_demo_data
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to setup demo data"
    exit 1
fi
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Demo credentials:"
echo "  Username: analyst@breatheesg.com"
echo "  Password: demo2026"
echo ""
echo "To start the server, run:"
echo "  python manage.py runserver"
echo ""
