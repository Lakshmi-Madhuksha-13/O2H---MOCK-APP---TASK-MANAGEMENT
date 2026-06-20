# Neptune Flow - AI-Powered Dual Workspace Task Management Platform

A full-stack, production-ready task management and project collaboration platform built with **React.js** (frontend) and **Node.js/Express** (backend).

---

## 🚀 Features

### 🏠 Personal Workspace
- My Tasks, Goals & Habit Tracker
- Pomodoro Focus Timer
- Calendar View, Notes
- Personal Analytics & Productivity Score
- Daily/Weekly/Monthly Goals

### 🏢 Organization Workspace
- Multi-role access: Super Admin, Admin, Project Manager, Team Lead, Employee
- Project Management & Sprint Planning
- Kanban Board, Scrum Board
- Team Collaboration & Discussions
- Time Tracking, Meeting Management
- Burndown Charts & Analytics
- Reports & Custom Dashboards

### 🤖 Neptune AI Assistant
- Convert natural language → tasks + subtasks
- Suggest priorities, deadlines, and categories
- Generate daily summaries and weekly reports

---

## 🛠️ Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React.js, Vite, Tailwind CSS v4 |
| Backend   | Node.js, Express.js            |
| Database  | JSON (db.json) — easily migrated to MongoDB |
| Auth      | JWT Tokens, Role-Based Access Control |

---

## 📁 Project Structure

```
neptuneflow/
├── backend/
│   ├── controllers/         # Auth, Tasks, Team, Admin, Workspace
│   ├── data/db.json         # Persistent JSON database
│   ├── utils/dbHelper.js    # DB read/write + auto-migration
│   └── server.js            # Express server (port 5000)
│
└── frontend/
    ├── src/
    │   ├── pages/           # Dashboard, Tasks, Analytics, etc.
    │   ├── components/      # MegaHeader, Kanban, Pomodoro, etc.
    │   ├── context/         # AuthContext, WorkspaceContext
    │   └── utils/api.js     # Axios API layer
    └── vite.config.js       # Port 5555
```

---

## ⚙️ How to Run

### 1. Clone the Repository
```bash
git clone https://github.com/Lakshmi-Madhuksha-13/O2H---MOCK-APP---TASK-MANAGEMENT.git
cd O2H---MOCK-APP---TASK-MANAGEMENT
```

### 2. Start the Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5555
```

### 4. Open the App
Visit **http://localhost:5555** in your browser.

---

## 🔐 Default Accounts

| Username | Password | Role  |
|----------|----------|-------|
| admin    | admin123 | Admin |

> New users can self-register as General Users via the Register page.

---

## 📊 Workspace Switcher

Click the **Neptune Flow** logo in the top-left to switch between:
- 🏠 **Personal Workspace** — Private productivity tools
- 🏢 **Organization Workspace** — Enterprise collaboration

---

## 📄 License

MIT License — Free to use for academic and commercial projects.
