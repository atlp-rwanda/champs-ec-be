// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "wishes",
      [
        {
          id: uuidv4(),
          userId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "8c1d2ace-f8b7-4e80-b966-7877b2fcf182",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          userId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "0e75be1a-762e-439f-af10-4a78a03ea635",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          userId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "c8bec8f8-eeeb-47d1-89f0-0cb1b504694d",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          userId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "075b82f8-f50b-4a7a-9309-c536cfafbeff",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          userId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "bc041af6-a5da-407f-81ea-2b2b8f095f6d",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          userId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "c83a7eeb-3781-4235-83bb-29f19b385068",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("wishes", null, {});
  }
};
