const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tests",
      [
        {
          id: uuidv4(),
          title: "test item one"
        },
        {
          id: uuidv4(),
          title: "test item two"
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tests", null, {});
  }
};
