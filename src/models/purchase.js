'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Purchase extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Purchase.belongsTo(models.Course)
        }
    }
    Purchase.init({
        userId: DataTypes.INTEGER,
        courseId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Purchase',
    });
    return Purchase;
};