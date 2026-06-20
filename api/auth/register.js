const { readDb, writeDb, setCors } = require('../_db');

module.exports = function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, email, password, department } = req.body;
  const db = readDb();

  if (!username || !email || !password)
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase()))
    return res.status(400).json({ error: 'Username already taken.' });
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(400).json({ error: 'Email already exists.' });

  const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
  const wsId = db.workspaces.length > 0 ? Math.max(...db.workspaces.map(w => w.id)) + 1 : 1;

  // Create personal workspace
  db.workspaces.push({
    id: wsId, name: 'Personal Workspace', type: 'Personal',
    ownerId: newId, createdAt: new Date().toISOString()
  });

  const newUser = {
    id: newId, username, email, password, role: 'User',
    department: department || 'General',
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`,
    fixed: false, bio: '',
    currentWorkspaceId: wsId,
    memberships: [{ workspaceId: wsId, role: 'Owner' }]
  };

  db.users.push(newUser);
  writeDb(db);

  const token = `neptune-token-${newUser.id}-${Date.now()}`;
  res.status(201).json({
    token,
    user: {
      id: newUser.id, username: newUser.username, email: newUser.email,
      role: newUser.role, department: newUser.department, avatar: newUser.avatar,
      bio: '', currentWorkspaceId: wsId,
      memberships: newUser.memberships, fixed: false
    }
  });
};
