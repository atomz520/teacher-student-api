module.exports = (sequelize, DataTypes) => 
  sequelize.define('Teacher', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })