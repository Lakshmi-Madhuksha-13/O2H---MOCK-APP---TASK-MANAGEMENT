const { readDb, getUserIdFromToken, setCors } = require('../_db');

module.exports = function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const memberships = user.memberships || [];
  const workspaceIds = memberships.map(m => m.workspaceId);
  const workspaces = db.workspaces.filter(w => workspaceIds.includes(w.id));

  res.json({ currentWorkspaceId: user.currentWorkspaceId, workspaces });
};
