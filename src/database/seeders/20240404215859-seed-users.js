module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          profile: "Software Developer",
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          googleID: "1234567890",
          photoUrl: "https://example.com/profile.jpg",
          email: "jane.smith@example.com",
          password: "password456",
          profile: "UI/UX Designer",
          verified: false,
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
("use strict");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: "a0ece5db-cd14-4f21-812f-966633e7be86",
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          profile: "Software Developer",
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "e8f8f8f8-d8ce-4335-8707-8d0ad9d89501",
          first_name: "Jane",
          last_name: "Smith",
          google_id: "1234567890",
          photo_url: "https://example.com/profile.jpg",
          email: "jane.smith@example.com",
          password: "password456",
          profile: "UI/UX Designer",
          verified: false,
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
