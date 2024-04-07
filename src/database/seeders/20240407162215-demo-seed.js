const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          password: "password123",
          profile: "Profile information for John Doe",
          verified: false,
          photo_url: "https://example.com/john.jpg",
          google_id: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          first_name: "Jane",
          last_name: "Smith",
          email: "jane@example.com",
          password: "password456",
          profile: "Profile information for Jane Smith",
          verified: false,
          photo_url: "https://example.com/jane.jpg",
          google_id: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  }
};
