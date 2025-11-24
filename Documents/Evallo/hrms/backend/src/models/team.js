const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Team = sequelize.define('Team', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'teams',
    timestamps: false,
  });
  return Team;
};
