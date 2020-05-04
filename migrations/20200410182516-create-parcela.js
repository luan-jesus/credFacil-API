'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('parcelas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parcelaNum: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      valorParcela: {
        type: Sequelize.DECIMAL
      },
      cobrado: {
        type: Sequelize.BOOLEAN
      },
      valorPago: {
        type: Sequelize.DECIMAL
      },
      dataParcela: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      emprestimoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'emprestimos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER
      },
      semanal: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('parcelas');
  }
};