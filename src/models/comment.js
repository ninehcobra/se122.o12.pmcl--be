'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            Comment.belongsTo(models.Blog, {
                foreignKey: 'id'
            })
            Comment.belongsTo(models.User, { foreignKey: 'ownerId' })
        }
    }
    Comment.init({
        ownerId: DataTypes.INTEGER,
        blogId: DataTypes.INTEGER,
        content: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};