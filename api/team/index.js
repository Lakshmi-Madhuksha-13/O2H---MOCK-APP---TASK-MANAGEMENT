const { readDb, writeDb, getUserIdFromToken, setCors } = require('../_db');

module.exports = function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // GET all team members
  if (req.method === 'GET') {
    return res.json(db.teams || []);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
