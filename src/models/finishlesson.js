'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FinishLesson extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            FinishLesson.belongsTo(models.Lesson, { foreignKey: 'lessonId' })
        }
    }
    FinishLesson.init({
        userId: DataTypes.INTEGER,
        lessonId: DataTypes.INTEGER,
        isCompleted: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'FinishLesson',
    });
    return FinishLesson;
};