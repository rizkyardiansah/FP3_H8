'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      {
        type: 'Clothes',
        sold_product_amount: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'Shoes',
        sold_product_amount: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'Shirts',
        sold_product_amount: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'Hats',
        sold_product_amount: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'Electronics',
        sold_product_amount: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
