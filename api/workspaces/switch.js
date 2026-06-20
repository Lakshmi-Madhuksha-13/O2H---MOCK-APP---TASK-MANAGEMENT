const { readDb, writeDb, getUserIdFromToken, setCors } = require('../../_db');

module.exports = function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { workspaceId } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const hasAccess = (user.memberships || []).some(m => m.workspaceId === parseInt(workspaceId));
  if (!hasAccess) return res.status(403).json({ error: 'Forbidden' });

  user.currentWorkspaceId = parseInt(workspaceId);
  writeDb(db);
  res.json({ success: true, currentWorkspaceId: user.currentWorkspaceId });
};
