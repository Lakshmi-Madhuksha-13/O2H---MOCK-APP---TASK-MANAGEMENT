const { readDb } = require('../utils/dbHelper');

const getWorkspaces = (req, res) => {
  const db = readDb();
  
  // Extract user ID from token
  const authHeader = req.headers.authorization;
  let userId = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const parts = token.split('-');
    if (parts.length >= 3) {
      userId = parseInt(parts[2]);
    }
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find workspaces where user is the owner or a member
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const memberships = user.memberships || [];
  const workspaceIds = memberships.map(m => m.workspaceId);

  const workspaces = db.workspaces.filter(w => workspaceIds.includes(w.id));

  res.json({
    currentWorkspaceId: user.currentWorkspaceId,
    workspaces
  });
};

const switchWorkspace = (req, res) => {
  const { workspaceId } = req.body;
  const db = readDb();
  const { writeDb } = require('../utils/dbHelper');

  const authHeader = req.headers.authorization;
  let userId = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const parts = token.split('-');
    if (parts.length >= 3) {
      userId = parseInt(parts[2]);
    }
  }

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Ensure user has access
  const hasAccess = user.memberships.some(m => m.workspaceId === parseInt(workspaceId));
  if (!hasAccess) return res.status(403).json({ error: 'Forbidden workspace access' });

  user.currentWorkspaceId = parseInt(workspaceId);
  writeDb(db);

  res.json({ success: true, currentWorkspaceId: user.currentWorkspaceId });
};

module.exports = { getWorkspaces, switchWorkspace };
