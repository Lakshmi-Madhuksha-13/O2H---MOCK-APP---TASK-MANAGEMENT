// Shared DB helper for Vercel serverless functions
const path = require('path');
const fs = require('fs');

const dbPath = path.join('/tmp', 'neptune_db.json');

function getSeedData() {
  try {
    const seedPath = path.join(process.cwd(), 'backend', 'data', 'db.json');
    if (fs.existsSync(seedPath)) {
      return JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    }
  } catch(e) {}
  return {};
}

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      const seed = getSeedData();
      const db = {
        users: seed.users || [],
        tasks: seed.tasks || [],
        logs: seed.logs || [],
        workspaces: seed.workspaces || [],
        projects: seed.projects || [],
        teams: seed.teams || [],
        sprints: seed.sprints || [],
        meetings: seed.meetings || [],
        notes: seed.notes || [],
        goals: seed.goals || [],
        habits: seed.habits || [],
        timeLogs: seed.timeLogs || [],
        activityLogs: seed.activityLogs || []
      };

      // Auto-migrate: assign personal workspaces to users
      db.users.forEach(user => {
        if (!user.currentWorkspaceId) {
          const maxId = db.workspaces.length > 0 ? Math.max(...db.workspaces.map(w => w.id)) : 0;
          const newId = maxId + 1;
          db.workspaces.push({
            id: newId, name: 'Personal Workspace', type: 'Personal',
            ownerId: user.id, createdAt: new Date().toISOString()
          });
          user.currentWorkspaceId = newId;
          user.memberships = [{ workspaceId: newId, role: 'Owner' }];
        }
      });

      // Auto-migrate: assign tasks to workspaces
      db.tasks.forEach(task => {
        if (!task.workspaceId) {
          const creator = db.users.find(u => u.username === task.createdBy) || db.users[0];
          if (creator) task.workspaceId = creator.currentWorkspaceId;
        }
      });

      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return db;
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch(e) {
    return { users: [], tasks: [], logs: [], workspaces: [], projects: [], teams: [], sprints: [], meetings: [], notes: [], goals: [], habits: [], timeLogs: [], activityLogs: [] };
  }
}

function writeDb(data) {
  try { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); } catch(e) {}
}

function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const parts = token.split('-');
  if (parts.length >= 3) return parseInt(parts[2]);
  return null;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = { readDb, writeDb, getUserIdFromToken, setCors };
