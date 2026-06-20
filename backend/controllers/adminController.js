const { readDb, writeDb, addAuditLog } = require('../utils/dbHelper');

const getSystemStats = (req, res) => {
  const db = readDb();
  
  const totalUsers = db.users.length;
  const totalTasks = db.tasks.length;
  const totalLogs = db.logs.length;
  
  const stats = {
    status: 'Healthy',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version,
    counts: {
      users: totalUsers,
      tasks: totalTasks,
      logs: totalLogs
    }
  };
  
  res.json(stats);
};

const getAuditLogs = (req, res) => {
  const db = readDb();
  const logs = [...(db.logs || [])].reverse();
  res.json(logs);
};

// Admin: Get all user accounts
const getUsers = (req, res) => {
  const db = readDb();
  // Strip password for security
  const users = (db.users || []).map(({ password, ...u }) => u);
  res.json(users);
};

// Admin: Update user details (username, role, department, bio)
const updateUser = (req, res) => {
  const { id } = req.params;
  const { role, department, username, bio } = req.body;
  const db = readDb();

  const userIndex = db.users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const oldUser = db.users[userIndex];
  
  // Guard: Protect fixed system accounts from having their roles changed if it breaks default credentials
  if (oldUser.fixed && role && role !== oldUser.role) {
    return res.status(400).json({ error: 'Cannot change role of system-fixed demo account to preserve platform integrity.' });
  }

  // Perform updates
  db.users[userIndex] = {
    ...oldUser,
    username: username || oldUser.username,
    role: role || oldUser.role,
    department: department || oldUser.department,
    bio: bio !== undefined ? bio : oldUser.bio
  };

  writeDb(db);
  
  addAuditLog(
    req.query.updatedBy || 'Admin', 
    'User Account Managed', 
    req.ip, 
    `Updated account: ${oldUser.username} (Role: ${oldUser.role}➔${role || oldUser.role})`
  );

  const { password, ...updatedUser } = db.users[userIndex];
  res.json(updatedUser);
};

// Admin: Delete user account
const deleteUser = (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const userIndex = db.users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userToDelete = db.users[userIndex];

  // Guard: Cannot delete fixed demo accounts
  if (userToDelete.fixed) {
    return res.status(400).json({ error: 'Cannot delete system-fixed demo accounts.' });
  }

  db.users.splice(userIndex, 1);
  writeDb(db);

  addAuditLog(
    req.query.deletedBy || 'Admin', 
    'User Account Deleted', 
    req.ip, 
    `Removed user account: "${userToDelete.username}"`
  );

  res.json({ message: 'User account removed successfully', id: parseInt(id) });
};

module.exports = {
  getSystemStats,
  getAuditLogs,
  getUsers,
  updateUser,
  deleteUser
};
