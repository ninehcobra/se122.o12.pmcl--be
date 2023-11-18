'use strict';
const {
    Model, DATEONLY
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BlogReact extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here


        }
    }
    BlogReact.init({
        type: DataTypes.STRING,
        comment: DataTypes.STRING,
        blogId: DataTypes.INTEGER,

    }, {
        sequelize,
        modelName: 'BlogReact',
    });
    return BlogReact;
};