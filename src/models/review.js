// models/review.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.Course, { foreignKey: 'courseId' });
            Review.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    Review.init({
        courseId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        rating: DataTypes.INTEGER, // Đánh giá từ 1 đến 5
        comment: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Review',
    });
    return Review;
};
