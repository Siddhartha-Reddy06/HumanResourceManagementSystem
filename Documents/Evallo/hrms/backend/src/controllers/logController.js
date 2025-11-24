const { Log, User } = require('../db');

const listLogs = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { userId, action } = req.query;
    const where = { organisation_id: req.user.orgId };
    if (userId) where.user_id = userId;
    if (action) where.action = action;
    const logs = await Log.findAll({ where, order: [['timestamp', 'DESC']] });
    res.json(logs);
  } catch (err) { next(err); }
};

module.exports = { listLogs };
