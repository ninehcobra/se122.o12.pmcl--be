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
                foreignKey: 'blogId'
            })
            Blog.belongsTo(models.User, { foreignKey: 'id' })
        }
    }
    Blog.init({
        ownerId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        thumbnail: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Blog',
    });
    return Blog;
};