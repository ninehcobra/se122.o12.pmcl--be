'use strict';
const {
    Model
} = require('sequelize');
const group = require('./group');
module.exports = (sequelize, DataTypes) => {
    class BlogTopic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

        }
    }
    BlogTopic.init({
        blogId: DataTypes.INTEGER,
        topicId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'BlogTopic',
    });
    return BlogTopic;
};