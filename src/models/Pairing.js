module.exports = (sequelize, DataTypes) => 
  sequelize.define('Pairing', {
    teacher: {
      type: DataTypes.STRING,
      allowNull: false
    },
    student:{
      type: DataTypes.STRING,
      allowNull: false
    }
  })