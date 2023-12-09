'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Course', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            ownerId: {
                type: Sequelize.INTEGER
            },

            isPublished: {
                type: Sequelize.BOOLEAN
            },

            newPrice: {
                type: Sequelize.INTEGER
            },
            oldPrice: {
                type: Sequelize.INTEGER
            },

            thumbnail: {
                type: Sequelize.STRING
            },

            categoryId: {
                type: Sequelize.INTEGER
            },

            attachments: {
                type: Sequelize.JSON
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Course');
    }
};