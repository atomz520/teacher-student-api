module.exports = (sequelize, DataTypes) => 
  sequelize.define('Student', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    suspend:{
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }
  })