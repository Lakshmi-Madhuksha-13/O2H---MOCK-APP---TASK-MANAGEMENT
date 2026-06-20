const { readDb, writeDb, addAuditLog } = require('../utils/dbHelper');

// Fixed role accounts - Admin and Developer cannot be self-registered
const FIXED_ROLES = ['Admin', 'Developer'];

const login = (req, res) => {
  const { username, password } = req.body;
  const db = readDb();

  const user = db.users.find(u => u.username === username && u.password === password);

  if (!user) {
    addAuditLog(username, 'Login Failure', req.ip, 'Invalid credentials provided');
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  addAuditLog(username, 'Login Success', req.ip, `User [${user.role}] authenticated successfully`);

  const token = `zenith-token-${user.id}-${Date.now()}`;
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
      fixed: user.fixed || false
    }
  });
};

const register = (req, res) => {
  const { username, email, password, department } = req.body;
  const db = readDb();

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  // Password strength check
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  // Check for duplicate username (case-insensitive)
  if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: 'Username already taken. Please choose another.' });
  }

  // Check for duplicate email
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  // Self-registration is ONLY allowed for the "User" role.
  // Admin and Developer accounts are system-managed and cannot be self-registered.
  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    username,
    email,
    password,
    role: 'User',          // Hard-locked to "User" for self-registration
    department: department || 'General',
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`,
    fixed: false,
    bio: ''
  };

  db.users.push(newUser);
  writeDb(db);

  addAuditLog(username, 'User Registration', req.ip, `New User account registered in department: ${newUser.department}`);

  const token = `zenith-token-${newUser.id}-${Date.now()}`;
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      avatar: newUser.avatar,
      bio: newUser.bio,
      fixed: false
    }
  });
};

module.exports = { login, register };
