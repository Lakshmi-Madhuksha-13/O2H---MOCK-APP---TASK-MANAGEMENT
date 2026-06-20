const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

const readDb = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      // Ensure the directory exists and write an empty database if missing
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const initialDb = { 
        users: [], tasks: [], logs: [], workspaces: [], projects: [], 
        teams: [], sprints: [], meetings: [], notes: [], goals: [], 
        habits: [], timeLogs: [], activityLogs: [] 
      };
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf8');
      return initialDb;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return { 
      users: [], tasks: [], logs: [], workspaces: [], projects: [], 
      teams: [], sprints: [], meetings: [], notes: [], goals: [], 
      habits: [], timeLogs: [], activityLogs: [] 
    };
  }
};

const writeDb = (data) => {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
};

const addAuditLog = (username, action, ipAddress, details) => {
  const db = readDb();
  const newLog = {
    id: db.logs.length > 0 ? Math.max(...db.logs.map(l => l.id)) + 1 : 1,
    timestamp: new Date().toISOString(),
    username: username || 'Anonymous',
    action,
    ipAddress: ipAddress || '127.0.0.1',
    details
  };
  db.logs.push(newLog);
  writeDb(db);
};

const initDb = () => {
  const db = readDb();
  let modified = false;

  // Ensure all collections exist
  const collections = ['workspaces', 'projects', 'teams', 'sprints', 'meetings', 'notes', 'goals', 'habits', 'timeLogs', 'activityLogs'];
  collections.forEach(col => {
    if (!db[col]) {
      db[col] = [];
      modified = true;
    }
  });

  // Ensure every user has a Personal Workspace
  db.users.forEach(user => {
    if (!user.currentWorkspaceId) {
      const newWsId = db.workspaces.length > 0 ? Math.max(...db.workspaces.map(w => w.id)) + 1 : 1;
      db.workspaces.push({
        id: newWsId,
        name: 'Personal Workspace',
        type: 'Personal',
        ownerId: user.id,
        createdAt: new Date().toISOString()
      });
      user.currentWorkspaceId = newWsId;
      user.memberships = [{ workspaceId: newWsId, role: 'Owner' }];
      modified = true;
    }
  });

  // Assign existing tasks to workspaces
  db.tasks.forEach(task => {
    if (!task.workspaceId) {
      // Find the user who created it
      const creator = db.users.find(u => u.username === task.createdBy) || db.users[0];
      if (creator && creator.currentWorkspaceId) {
        task.workspaceId = creator.currentWorkspaceId;
        modified = true;
      }
    }
  });

  if (modified) {
    writeDb(db);
    console.log('Database auto-migrated successfully for Enterprise Dual-Workspace features.');
  }
};

module.exports = {
  readDb,
  writeDb,
  addAuditLog,
  initDb
};
