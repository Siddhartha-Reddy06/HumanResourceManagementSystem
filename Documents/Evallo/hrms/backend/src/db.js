const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const Organisation = require('./models/organisation')(sequelize);
const User = require('./models/user')(sequelize);
const Employee = require('./models/employee')(sequelize);
const Team = require('./models/team')(sequelize);
const EmployeeTeam = require('./models/employeeTeam')(sequelize);
const Log = require('./models/log')(sequelize);

Organisation.hasMany(User, { foreignKey: 'organisation_id' });
User.belongsTo(Organisation, { foreignKey: 'organisation_id' });

Organisation.hasMany(Employee, { foreignKey: 'organisation_id' });
Employee.belongsTo(Organisation, { foreignKey: 'organisation_id' });

Organisation.hasMany(Team, { foreignKey: 'organisation_id' });
Team.belongsTo(Organisation, { foreignKey: 'organisation_id' });

Organisation.hasMany(Log, { foreignKey: 'organisation_id' });
Log.belongsTo(Organisation, { foreignKey: 'organisation_id' });

User.hasMany(Log, { foreignKey: 'user_id' });
Log.belongsTo(User, { foreignKey: 'user_id' });

Employee.belongsToMany(Team, { through: EmployeeTeam, foreignKey: 'employee_id' });
Team.belongsToMany(Employee, { through: EmployeeTeam, foreignKey: 'team_id' });

EmployeeTeam.belongsTo(Employee, { foreignKey: 'employee_id' });
EmployeeTeam.belongsTo(Team, { foreignKey: 'team_id' });

module.exports = {
  sequelize,
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log,
};
