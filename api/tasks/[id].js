const { readDb, writeDb, getUserIdFromToken, setCors } = require('../../_db');

module.exports = function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const taskId = parseInt(id);
  const db = readDb();
  const userId = getUserIdFromToken(req);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const taskIndex = db.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  // PUT /api/tasks/[id]
  if (req.method === 'PUT') {
    const updates = req.body;
    db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...updates, id: taskId };
    writeDb(db);
    return res.json(db.tasks[taskIndex]);
  }

  // DELETE /api/tasks/[id]
  if (req.method === 'DELETE') {
    db.tasks.splice(taskIndex, 1);
    writeDb(db);
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
