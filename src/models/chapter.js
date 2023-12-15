'use strict';
const {
    Model
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
            Chapter.belongsTo(models.Course)
        }
    }
    Chapter.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        videoUrl: DataTypes.STRING,
        position: DataTypes.INTEGER,
        isPublished: DataTypes.BOOLEAN,
        isFree: DataTypes.BOOLEAN,
        courseId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Chapter',
    });
    return Chapter;
};