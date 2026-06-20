const { readDb, writeDb, getUserIdFromToken, setCors } = require('../_db');

module.exports = function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = getUserIdFromToken(req);

  // GET /api/tasks
  if (req.method === 'GET') {
    const db = readDb();
    // Return tasks for the authenticated user or all tasks for admin
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const tasks = user.role === 'Admin'
      ? db.tasks
      : db.tasks.filter(t => t.createdBy === user.username || t.assignee === user.username);
    return res.json(tasks);
  }

  // POST /api/tasks
  if (req.method === 'POST') {
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const db = readDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { title, description, status, priority, dueDate, assignee, category, tags } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newTask = {
      id: db.tasks.length > 0 ? Math.max(...db.tasks.map(t => t.id)) + 1 : 1,
      title, description: description || '',
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      assignee: assignee || user.username,
      category: category || 'General',
      tags: tags || [],
      comments: [],
      workspaceId: user.currentWorkspaceId,
      createdBy: user.username,
      createdAt: new Date().toISOString()
    };
    db.tasks.push(newTask);
    writeDb(db);
    return res.status(201).json(newTask);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
