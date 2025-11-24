require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Organisation, User } = require('./db');

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const orgName = process.env.SEED_ORG_NAME || 'Acme Inc';
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@acme.test';
    const adminPass = process.env.SEED_ADMIN_PASS || 'Password123!';

    const [org] = await Organisation.findOrCreate({ where: { name: orgName }, defaults: { name: orgName } });

    const existing = await User.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const password_hash = await bcrypt.hash(adminPass, 10);
      await User.create({ organisation_id: org.id, email: adminEmail, password_hash, name: 'Admin', role: 'admin' });
      console.log(`Seeded org=${org.name} id=${org.id}, admin=${adminEmail}`);
    } else {
      console.log('Admin already exists, skipping');
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
