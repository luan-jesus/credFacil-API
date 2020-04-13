'use strict';

const Cliente = require('../Models').cliente;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('emprestimos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      valorEmprestimo: {
        type: Sequelize.DECIMAL
      },
      valorAReceber: {
        type: Sequelize.DECIMAL
      },
      valorPago: {
        type: Sequelize.DECIMAL
      },
      numParcelas: {
        type: Sequelize.INTEGER
      },
      numParcelasPagas: {
        type: Sequelize.INTEGER
      },
      dataInicio: {
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
      clienteId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'clientes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('emprestimos');
  }
};