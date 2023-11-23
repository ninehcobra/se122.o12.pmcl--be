'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Blog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Blog.hasMany(models.Comment, {

                foreignKey: {
                    name: 'blogId',
                    onDelete: 'CASCADE',
                }
            })
            Blog.belongsTo(models.User, { foreignKey: 'ownerId' })
            Blog.belongsToMany(models.Topic, { through: 'BlogTopic' })
        }
    }
    Blog.init({
        ownerId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        contentHTML: DataTypes.TEXT('long'),
        contentMarkdown: DataTypes.TEXT('long'),
    }, {
        sequelize,
        modelName: 'Blog',
    });
    return Blog;
};