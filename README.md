# Learning Management System

A full-stack learning management system built with React and Django.

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Django backend application

## Setup Instructions

### Backend Setup 
bash
cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
bash
cd frontend
npm install
npm start
bash
git add .
git commit -m "Initial commit: Merged frontend and backend"
json
{
"proxy": "http://localhost:8000"
}
bash
cd backend
pip freeze > requirements.txt
yaml:docker-compose.yml
version: '3.8'
services:
backend:
build: ./backend
ports:
"8000:8000"
volumes:
./backend:/app
environment:
DEBUG=1
frontend:
build: ./frontend
ports:
"3000:3000"
volumes:
./frontend:/app
depends_on:
backend