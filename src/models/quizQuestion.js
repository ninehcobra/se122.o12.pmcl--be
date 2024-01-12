'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuizQuestion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            QuizQuestion.belongsTo(models.QuizzesLesson, { foreignKey: 'quizzesLessonId' });
            QuizQuestion.hasMany(models.QuizOption, { foreignKey: 'quizQuestionId' });
        }
    }
    QuizQuestion.init({
        content: DataTypes.TEXT, // Nội dung của câu hỏi
        quizzesLessonId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'QuizQuestion',
    });
    return QuizQuestion;
};