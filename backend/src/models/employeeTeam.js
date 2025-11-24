const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const EmployeeTeam = sequelize.define('EmployeeTeam', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    team_id: { type: DataTypes.INTEGER, allowNull: false },
    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'employee_teams',
    timestamps: false,
  });
  return EmployeeTeam;
};
