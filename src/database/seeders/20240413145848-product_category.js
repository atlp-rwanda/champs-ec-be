// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "product_categories",
      [
        {
          id: uuidv4(),
          categoryName: "Furniture",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          categoryName: "Cosumetic",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          categoryName: "Fashion",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  }
};
