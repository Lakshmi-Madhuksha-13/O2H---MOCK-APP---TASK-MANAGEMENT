const express = require('express');
const cors = require('cors');
const path = require('path');

const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const teamController = require('./controllers/teamController');
const adminController = require('./controllers/adminController');
const workspaceController = require('./controllers/workspaceController');

const { initDb } = require('./utils/dbHelper');

const app = express();
const PORT = process.env.PORT || 5000;

// Run database migration once on startup
initDb();

// Enable CORS for all localhost origins (dev flexibility)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from any localhost port or no origin (like Postman)
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Logger middleware for testing requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Auth Routes
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.register);

// Task CRUD Routes
app.get('/api/tasks', taskController.getTasks);
app.post('/api/tasks', taskController.createTask);
app.put('/api/tasks/:id', taskController.updateTask);
app.delete('/api/tasks/:id', taskController.deleteTask);
// Task Comments
app.post('/api/tasks/:id/comments', taskController.addComment);

// Workspace Routes
app.get('/api/workspaces', workspaceController.getWorkspaces);
app.post('/api/workspaces/switch', workspaceController.switchWorkspace);

// Team Management Routes
app.get('/api/team', teamController.getTeam);
app.post('/api/team', teamController.addMember);
app.put('/api/team/:id', teamController.updateMember);
app.delete('/api/team/:id', teamController.removeMember);

// Admin Health, Log & User Management Routes
app.get('/api/admin/stats', adminController.getSystemStats);
app.get('/api/admin/logs', adminController.getAuditLogs);
app.get('/api/admin/users', adminController.getUsers);
app.put('/api/admin/users/:id', adminController.updateUser);
app.delete('/api/admin/users/:id', adminController.deleteUser);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(` Zenith Tasks Portal Backend Server is Running!`);
  console.log(` Port: ${PORT}`);
  console.log(` Environment: development`);
  console.log(`========================================`);
});
