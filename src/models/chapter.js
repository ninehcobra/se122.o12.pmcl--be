'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Chapter extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Chapter.belongsTo(models.Course);
            Chapter.hasMany(models.Lesson, { foreignKey: 'ChapterId' });
        }
    }
    Chapter.init({
        title: DataTypes.STRING,
        courseId: DataTypes.INTEGER,
        position: DataTypes.INTEGER,
        isPublished: DataTypes.BOOLEAN,
        isFree: DataTypes.BOOLEAN,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Chapter',
    });
    return Chapter;
};