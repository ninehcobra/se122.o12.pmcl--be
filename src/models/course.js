'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Course.belongsToMany(models.User, { through: 'UserCourse', foreignKey: 'courseId' })
            Course.belongsToMany(models.User, { through: 'Payment', foreignKey: 'courseId' })
            Course.belongsTo(models.Category)
        }
    }
    Course.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        ownerId: DataTypes.INTEGER,

        isPublished: DataTypes.BOOLEAN,

        newPrice: DataTypes.INTEGER,
        oldPrice: DataTypes.INTEGER,

        thumbnail: DataTypes.STRING,

        categoryId: DataTypes.INTEGER,

        attachments: DataTypes.JSON
    }, {
        sequelize,
        modelName: 'Course',
    });
    return Course;
};