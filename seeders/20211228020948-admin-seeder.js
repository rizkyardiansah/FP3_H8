'use strict';
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        full_name: "Admin Rizal",
        email: "rizal@admin.com",
        password: await bcrypt.hash("rizal123alkdsjfalskdf", 10),
        gender: "male",
        role: "admin",
        balance: "99999999",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
