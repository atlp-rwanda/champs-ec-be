const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          first_name: "Emmanuel",
          last_name: "munezero",
          email: "test@gmail.com",
          password: uuidv4(),
          profile: "test.png"
        },
        {
          id: uuidv4(),
          first_name: "Emmanuel",
          last_name: "munezero",
          email: "test2@gmail.com",
          password: uuidv4(),
          profile: "test.png"
        },
        {
          id: uuidv4(),
          first_name: "Emmanuel",
          last_name: "munezero",
          email: "test3@gmail.com",
          password: uuidv4(),
          profile: "test.png"
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  }
};
