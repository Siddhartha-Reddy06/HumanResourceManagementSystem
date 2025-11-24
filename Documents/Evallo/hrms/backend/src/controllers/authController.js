const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../db');

const register = async (req, res, next) => {
  try {
    const { orgName, adminName, email, password } = req.body;
    if (!orgName || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const t = await Organisation.sequelize.transaction();
    try {
      const org = await Organisation.create({ name: orgName }, { transaction: t });
      const password_hash = await bcrypt.hash(password, 10);
      const user = await User.create({ organisation_id: org.id, email, password_hash, name: adminName || 'Admin', role: 'admin' }, { transaction: t });
      await Log.create({ organisation_id: org.id, user_id: user.id, action: 'organisation_created', meta: { orgId: org.id, email } }, { transaction: t });
      await t.commit();
      const token = jwt.sign({ userId: user.id, orgId: org.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
      return res.status(201).json({ token });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, orgId: user.organisation_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    await Log.create({ organisation_id: user.organisation_id, user_id: user.id, action: 'user_logged_in', meta: { email } });
    return res.json({ token });
  } catch (err) { next(err); }
};

module.exports = { register, login };
