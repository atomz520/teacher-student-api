module.exports = (sequelize, DataTypes) => 
  sequelize.define('Habit', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    month: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })