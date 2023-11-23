'use strict';
const {
    Model
} = require('sequelize');
const group = require('./group');
module.exports = (sequelize, DataTypes) => {
    class Topic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Topic.belongsToMany(models.Blog, { through: 'BlogTopic' })
        }
    }
    Topic.init({
        type: DataTypes.STRING,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Topic',
    });
    return Topic;
};