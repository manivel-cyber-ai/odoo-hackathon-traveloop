#!/bin/bash
set -e
export PYTHONPATH=/home/runner/workspace/.pythonlibs/lib/python3.11/site-packages:$PYTHONPATH
export PATH=/home/runner/workspace/.pythonlibs/bin:$PATH

echo "Running migrations..."
python3 manage.py migrate --noinput

echo "Collecting static files..."
python3 manage.py collectstatic --noinput 2>/dev/null || true

echo "Creating admin..."
python3 manage.py create_admin 2>/dev/null || true

echo "Seeding cities..."
python3 manage.py seed_cities 2>/dev/null || true

echo "Seeding community posts..."
python3 manage.py seed_community 2>/dev/null || true

echo "Starting server..."
python3 manage.py runserver 0.0.0.0:5000
