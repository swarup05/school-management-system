# Warana Valley School - School Management System

A full-stack **Private School Management System** for **Warana Valley School, Sagaon** built with React, Node.js, and MySQL.

## Features

- 🔐 **JWT-based authentication** for Admin, Teacher, and Parent roles
- 👨‍💼 **Admin Portal** — Staff directory, class-wise student records, notice board
- 👩‍🏫 **Teacher Portal** — Attendance marking, homework upload, marks entry
- 👨‍👩‍👦 **Parent Portal** — View child's attendance, homework, fees, and notices
- 📋 **Standardized** class structure: Playgroup, LKG, UKG, 1st–10th Standard

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MySQL |
| Auth | JWT + bcryptjs |

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=school_management
JWT_SECRET=your_jwt_secret
```
Import the database schema:
```bash
mysql -u root -p < ../schema.sql
```
Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App
Open `http://localhost:5173` in your browser.

**Admin Login:** `admin@wvssagaon.com` / `admin123`

## School Info
**Warana Valley School, Sagaon**  
CBSE Affiliation No: 1130759  
Sagaon Sarud Road, Near Warana River Bridge  
Tal. Shirala, Dist. Sangli - 415408
