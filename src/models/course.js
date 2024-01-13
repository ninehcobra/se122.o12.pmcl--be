// models/course.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        static associate(models) {
            Course.hasMany(models.Purchase, { foreignKey: 'courseId' });
            Course.belongsTo(models.Category, { foreignKey: 'categoryId' });
            Course.hasMany(models.Chapter, { foreignKey: 'courseId' });
            Course.hasMany(models.Review, { foreignKey: 'courseId' });
        }
    }
    Course.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        ownerId: DataTypes.INTEGER,
        isPublished: DataTypes.BOOLEAN,
        newPrice: DataTypes.INTEGER,
        oldPrice: DataTypes.INTEGER,
        thumbnail: DataTypes.STRING,
        categoryId: DataTypes.INTEGER,
        overview: DataTypes.JSON, // Mô tả tổng quan về khóa học
        learningObjectives: DataTypes.JSON, // Mục tiêu học tập
    }, {
        sequelize,
        modelName: 'Course',
    });
    return Course;
};
