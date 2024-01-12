'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuizzesLesson extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            QuizzesLesson.belongsTo(models.Lesson, { foreignKey: 'lessonId', onDelete: 'CASCADE' });
        }
    }
    QuizzesLesson.init({
        questions: DataTypes.JSON,
        duration: DataTypes.INTEGER,
        passingScore: DataTypes.INTEGER,
        lessonId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'QuizzesLesson',
    });
    return QuizzesLesson;
};