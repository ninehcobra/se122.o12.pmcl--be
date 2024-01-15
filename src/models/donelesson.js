'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DoneLesson extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            DoneLesson.belongsTo(models.Lesson, { foreignKey: 'lessonId' })
        }
    }
    DoneLesson.init({
        userId: DataTypes.INTEGER,
        lessonId: DataTypes.INTEGER,
        isCompleted: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'DoneLesson',
    });
    return DoneLesson;
};