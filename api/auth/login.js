// Vercel Serverless Function: /api/auth/login
const path = require('path');
const fs = require('fs');

// Inline DB helper for serverless (reads from /tmp in production, or local data/ in dev)
const dbPath = path.join('/tmp', 'db.json');
const seedPath = path.join(process.cwd(), 'backend', 'data', 'db.json');

function readDb() {
  try {
    // In Vercel, /tmp is writable. Seed from the static db.json on cold start.
    if (!fs.existsSync(dbPath)) {
      const seed = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, 'utf8') : '{}';
      const seedData = JSON.parse(seed);
      const initialDb = {
        users: seedData.users || [],
        tasks: seedData.tasks || [],
        logs: seedData.logs || [],
        workspaces: seedData.workspaces || [],
        projects: seedData.projects || [],
        teams: seedData.teams || [],
        sprints: seedData.sprints || [],
        meetings: seedData.meetings || [],
        notes: seedData.notes || [],
        goals: seedData.goals || [],
        habits: seedData.habits || [],
        timeLogs: seedData.timeLogs || [],
        activityLogs: seedData.activityLogs || []
      };
      // Auto-assign workspaces to users if missing
      initialDb.users.forEach(user => {
        if (!user.currentWorkspaceId) {
          const newWsId = initialDb.workspaces.length > 0
            ? Math.max(...initialDb.workspaces.map(w => w.id)) + 1
            : initialDb.users.indexOf(user) + 1;
          initialDb.workspaces.push({
            id: newWsId,
            name: 'Personal Workspace',
            type: 'Personal',
            ownerId: user.id,
            createdAt: new Date().toISOString()
          });
          user.currentWorkspaceId = newWsId;
          user.memberships = [{ workspaceId: newWsId, role: 'Owner' }];
        }
      });
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    return { users: [], tasks: [], logs: [], workspaces: [], projects: [], teams: [], sprints: [], meetings: [], notes: [], goals: [], habits: [], timeLogs: [], activityLogs: [] };
  }
}

function writeDb(data) {
  try { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); } catch(e) {}
}

module.exports = function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = `neptune-token-${user.id}-${Date.now()}`;
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
      bio: user.bio || '',
      currentWorkspaceId: user.currentWorkspaceId,
      memberships: user.memberships || [],
      fixed: user.fixed || false
    }
  });
};
