const { readDb, writeDb, getUserIdFromToken, setCors } = require('../../_db');

module.exports = function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  const taskId = parseInt(id);
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  const task = db.tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Comment text required' });

  const comment = {
    id: Date.now(),
    author: user ? user.username : 'Unknown',
    text,
    timestamp: new Date().toISOString()
  };
  if (!task.comments) task.comments = [];
  task.comments.push(comment);
  writeDb(db);

  res.status(201).json(comment);
};
