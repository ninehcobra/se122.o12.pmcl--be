'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuizOption extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            QuizOption.belongsTo(models.QuizQuestion, { foreignKey: 'quizQuestionId' });
        }
    }
    QuizOption.init({
        content: DataTypes.TEXT, // Nội dung của lựa chọn đáp án
        isCorrect: DataTypes.BOOLEAN, // Xác định liệu lựa chọn này có phải là đáp án đúng hay không
        quizQuestionId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'QuizOption',
    });
    return QuizOption;
};