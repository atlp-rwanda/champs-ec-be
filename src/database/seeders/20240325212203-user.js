// eslint-disable-next-line import/no-import-module-exports, @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    const [adminRole, sellerRole, buyerRole] = await Promise.all([
      queryInterface.rawSelect("roles", { where: { name: "admin" } }, ["id"]),
      queryInterface.rawSelect("roles", { where: { name: "seller" } }, ["id"]),
      queryInterface.rawSelect("roles", { where: { name: "buyer" } }, ["id"])
    ]);

    if (!adminRole) {
      throw new Error("Roles 'admin' and/or 'buyer' not found in Role table.");
    }
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "test1@gmail.com",
          password:
            "$2b$12$Alp9r553SHLbOWXbtJfl.O40EAzAZQEfvspOXLX1Xoo08ZKCTnF4i",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          roleId: buyerRole,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "emmanuelmunezero@gmail.com",
          password:
            "$2b$12$Alp9r553SHLbOWXbtJfl.O40EAzAZQEfvspOXLX1Xoo08ZKCTnF4i",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          roleId: sellerRole,
          verified: true,
          profileImage: "test.png",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "kayigm105@gmail.com",
          password:
            "$2b$12$Alp9r553SHLbOWXbtJfl.O40EAzAZQEfvspOXLX1Xoo08ZKCTnF4i",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          roleId: sellerRole,
          profileImage: "test.png",
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "uwimanajanet563@gmail.com",
          password:
            "$2b$12$Alp9r553SHLbOWXbtJfl.O40EAzAZQEfvspOXLX1Xoo08ZKCTnF4i",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          roleId: sellerRole,
          profileImage: "test.png",
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "test4@gmail.com",
          password:
            "$2b$12$Alp9r553SHLbOWXbtJfl.O40EAzAZQEfvspOXLX1Xoo08ZKCTnF4i",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          roleId: buyerRole,
          verified: true,
          profileImage: "test.png",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "admin@gmail.com",
          password:
            "$2b$12$Alp9r553SHLbOWXbtJfl.O40EAzAZQEfvspOXLX1Xoo08ZKCTnF4i",
          phone: "+250786534335",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          roleId: adminRole,
          verified: true,
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
