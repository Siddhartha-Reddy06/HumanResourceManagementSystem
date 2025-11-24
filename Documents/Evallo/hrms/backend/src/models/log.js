const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Log = sequelize.define('Log', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organisation_id: { type: DataTypes.INTEGER },
    user_id: { type: DataTypes.INTEGER },
    action: { type: DataTypes.STRING },
    meta: { type: DataTypes.JSONB },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'logs',
    timestamps: false,
  });
  return Log;
};
