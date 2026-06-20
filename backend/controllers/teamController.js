const { readDb, writeDb, addAuditLog } = require('../utils/dbHelper');

const getTeam = (req, res) => {
  const db = readDb();
  // Do not expose user passwords
  const team = db.users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    department: u.department,
    avatar: u.avatar
  }));
  res.json(team);
};

const addMember = (req, res) => {
  const { username, email, role, department } = req.body;
  const db = readDb();

  if (!username || !email || !role || !department) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
  
  const newMember = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    username,
    email,
    password: 'defaultpassword123',
    role,
    department,
    avatar: defaultAvatar
  };

  db.users.push(newMember);
  writeDb(db);

  addAuditLog(req.query.requestedBy || 'Admin', 'Add Team Member', req.ip, `Added member ${username} with role ${role}`);

  res.status(201).json({
    id: newMember.id,
    username: newMember.username,
    email: newMember.email,
    role: newMember.role,
    department: newMember.department,
    avatar: newMember.avatar
  });
};

const updateMember = (req, res) => {
  const { id } = req.params;
  const { role, department } = req.body;
  const db = readDb();

  const userIndex = db.users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  db.users[userIndex].role = role || db.users[userIndex].role;
  db.users[userIndex].department = department || db.users[userIndex].department;
  
  writeDb(db);

  addAuditLog(
    req.query.requestedBy || 'Admin', 
    'Update Team Member', 
    req.ip, 
    `Updated member ${db.users[userIndex].username} to role ${role} in ${department}`
  );

  res.json({
    id: db.users[userIndex].id,
    username: db.users[userIndex].username,
    email: db.users[userIndex].email,
    role: db.users[userIndex].role,
    department: db.users[userIndex].department,
    avatar: db.users[userIndex].avatar
  });
};

const removeMember = (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const userIndex = db.users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  const username = db.users[userIndex].username;
  db.users.splice(userIndex, 1);
  writeDb(db);

  addAuditLog(req.query.requestedBy || 'Admin', 'Remove Team Member', req.ip, `Removed member ${username}`);

  res.json({ message: 'Member removed successfully', id: parseInt(id) });
};

module.exports = {
  getTeam,
  addMember,
  updateMember,
  removeMember
};
