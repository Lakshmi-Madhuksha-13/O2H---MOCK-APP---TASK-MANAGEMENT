const { readDb, writeDb, addAuditLog } = require('../utils/dbHelper');

const getTasks = (req, res) => {
  const db = readDb();
  let tasks = db.tasks || [];

  // Filter out default tasks for User accounts
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const parts = token.split('-');
    if (parts.length >= 3) {
      const userId = parseInt(parts[2]);
      const requestingUser = db.users.find(u => u.id === userId);
      if (requestingUser && requestingUser.role === 'User') {
        // Users only see tasks assigned to them or created by them (starts with 0 default tasks)
        tasks = tasks.filter(t => 
          (t.assignee && t.assignee.toLowerCase() === requestingUser.username.toLowerCase()) ||
          (t.createdBy && t.createdBy.toLowerCase() === requestingUser.username.toLowerCase()) ||
          t.assigneeId === requestingUser.id
        );
      }
    }
  }

  res.json(tasks);
};

const createTask = (req, res) => {
  const { title, description, priority, status, category, assignee, assigneeId, dueDate, createdBy } = req.body;
  const db = readDb();

  if (!title || !priority || !status || !category) {
    return res.status(400).json({ error: 'Title, priority, status, and category are required' });
  }

  const newTask = {
    id: db.tasks.length > 0 ? Math.max(...db.tasks.map(t => t.id)) + 1 : 1,
    title,
    description: description || '',
    priority,
    status,
    category,
    assignee: assignee || 'Unassigned',
    assigneeId: assigneeId ? parseInt(assigneeId) : null,
    dueDate: dueDate || null,
    createdBy: createdBy || 'System',
    createdAt: new Date().toISOString(),
    comments: []
  };

  db.tasks.push(newTask);
  writeDb(db);
  addAuditLog(createdBy, 'Task Creation', req.ip, `Created task ID ${newTask.id}: "${title}"`);
  res.status(201).json(newTask);
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const db = readDb();

  const taskIndex = db.tasks.findIndex(t => t.id === parseInt(id));
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  const oldTask = db.tasks[taskIndex];
  db.tasks[taskIndex] = { ...oldTask, ...updates, id: oldTask.id, comments: oldTask.comments || [] };
  writeDb(db);

  addAuditLog(
    updates.updatedBy || 'System',
    'Task Update',
    req.ip,
    `Updated task ID ${id}. Status: ${oldTask.status} → ${updates.status || oldTask.status}`
  );

  res.json(db.tasks[taskIndex]);
};

const deleteTask = (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const taskIndex = db.tasks.findIndex(t => t.id === parseInt(id));
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  const deletedTask = db.tasks[taskIndex];
  db.tasks.splice(taskIndex, 1);
  writeDb(db);

  addAuditLog(req.query.deletedBy || 'System', 'Task Deletion', req.ip, `Deleted task ID ${id}: "${deletedTask.title}"`);
  res.json({ message: 'Task deleted successfully', id: parseInt(id) });
};

// Add a comment to a task
const addComment = (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;
  const db = readDb();

  if (!author || !text) {
    return res.status(400).json({ error: 'Author and text are required' });
  }

  const taskIndex = db.tasks.findIndex(t => t.id === parseInt(id));
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  if (!db.tasks[taskIndex].comments) {
    db.tasks[taskIndex].comments = [];
  }

  const newComment = {
    id: db.tasks[taskIndex].comments.length > 0
      ? Math.max(...db.tasks[taskIndex].comments.map(c => c.id)) + 1
      : 1,
    author,
    text,
    timestamp: new Date().toISOString()
  };

  db.tasks[taskIndex].comments.push(newComment);
  writeDb(db);

  addAuditLog(author, 'Task Comment', req.ip, `Added comment on task ID ${id}`);
  res.status(201).json(newComment);
};

module.exports = { getTasks, createTask, updateTask, deleteTask, addComment };
