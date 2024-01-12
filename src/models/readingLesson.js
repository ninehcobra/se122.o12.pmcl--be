'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReadingLesson extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ReadingLesson.belongsTo(models.Lesson, { foreignKey: 'lessonId', onDelete: 'CASCADE' });
        }
    }
    ReadingLesson.init({
        content: DataTypes.TEXT, // Thêm trường nội dung cho reading chapter
        lessonId: DataTypes.INTEGER, // Thêm trường lessonId cho reading chapter
    }, {
        sequelize,
        modelName: 'ReadingLesson',
    });
    return ReadingLesson;
};