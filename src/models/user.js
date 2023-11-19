'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Group)
      User.belongsToMany(models.Course, { through: 'UserCourse', foreignKey: 'id' })
      User.belongsToMany(models.Course, { through: 'Payment', foreignKey: 'id' })
      User.hasMany(models.Blog, {
        foreignKey: 'id'
      })
      User.hasMany(models.Comment, {
        foreignKey: 'id'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    groupId: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    gender: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};