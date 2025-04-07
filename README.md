# 🤖 Robomaster Rush & Find Leaderboard

A web application for tracking participants in the **Robomaster Rush & Find** challenge, where robots navigate a maze to scan visual markers in a timed competition.

---

## 📝 Overview

This leaderboard displays participants' times as they navigate **DJI Robomasters** through a maze to scan visual markers. The application features a sleek, modern interface with a **futuristic design** suitable for a robotics competition.

---

## 🚀 Features

- **🎯 Interactive Leaderboard**: Real-time display of participants sorted by fastest times  
- **🧑‍💻 Participant Management**: Add new participants with custom avatars  
- **🏫 School Tracking**: Display participant affiliations  

### ✨ Visual Effects

- Dynamic dot-pattern textures for visual interest  
- Special highlighting for top performers  
- Futuristic text effects including glitch animation  

- **📱 Responsive Design**: Works on various screen sizes  
- **💾 Data Persistence**: SQLite database for reliable storage  

---

## ⚙️ Technology Stack

- **Frontend**: React + Tailwind CSS  
- **Backend**: FastAPI (Python)  
- **Database**: SQLite with SQLAlchemy  
- **Build Tool**: Vite  

---

## 🏁 Getting Started

### ✅ Prerequisites

- Python 3.7+  
- Node.js 14+  
- `npm` or `yarn`  
- Git (optional, for cloning)

---

### 🚀 Quick Start (Windows)

The simplest way to run the application:

1. Double-click `start_leaderboard.bat` in the root directory  
2. Wait for the server to start  
3. Your browser will open at: [http://localhost:8000](http://localhost:8000)

---

### ⚙️ Manual Setup

#### 🔧 Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # For Windows
# source venv/bin/activate  # For macOS/Linux

pip install -r requirements.txt
python main.py
```
#### 💻 Frontend (Optional for development)
```bash
cd robotics-leaderboard-frontend
npm install
npm run dev           # For development
npm run build         # For production
```
# 📁 Project Structure
```php
robotics-leaderboard/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   ├── robotics_leaderboard.db    # SQLite database
│   └── static/                    # Frontend static files
├── robotics-leaderboard-frontend/ # React frontend source
│   ├── src/                       # Source code
│   ├── public/                    # Static assets
│   └── package.json               # NPM configuration
└── start_leaderboard.bat          # Quick start batch file
```
