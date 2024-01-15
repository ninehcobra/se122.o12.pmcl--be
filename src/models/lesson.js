'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Lesson extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Lesson.belongsTo(models.Chapter, { foreignKey: 'ChapterId' });
            Lesson.hasOne(models.ReadingLesson, { foreignKey: 'lessonId' });
            Lesson.hasOne(models.QuizzesLesson, { foreignKey: 'lessonId' });
            Lesson.hasOne(models.VideoLesson, { foreignKey: 'lessonId' });

            // Lesson.hasOne(models.Progress, { foreignKey: 'lessonId' });
        }
    }
    Lesson.init({
        title: DataTypes.STRING,
        lessonType: DataTypes.STRING, // Loại bài học (video, reading, quizzes)
        duration: DataTypes.INTEGER, // Thời gian hoàn thành bài học
        ChapterId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Lesson',
    });
    return Lesson;
};