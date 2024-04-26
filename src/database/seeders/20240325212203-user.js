// eslint-disable-next-line import/no-import-module-exports
// import { v4 as uuidv4 } from "uuid";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "ema1@gmail.com",
          password: uuidv4(),
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "viva35@gmail.com",
          password: uuidv4(),
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "test55@gmail.com",
          // email: "test22@gmail.com",
          password: uuidv4(),
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "test44@gmail.com",
          password: uuidv4(),
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  }
};
