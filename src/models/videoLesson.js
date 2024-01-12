'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VideoLesson extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            VideoLesson.belongsTo(models.Lesson, { foreignKey: 'lessonId', onDelete: 'CASCADE' });
        }
    }
    VideoLesson.init({
        videoUrl: DataTypes.STRING,
        lessonId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'VideoLesson',
    });
    return VideoLesson;
};