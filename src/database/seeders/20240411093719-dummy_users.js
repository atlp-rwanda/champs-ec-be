// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    const [adminRole, userRole, sellerRole, buyerRole] = await Promise.all([
      queryInterface.rawSelect("roles", { where: { name: "admin" } }, ["id"]),
      queryInterface.rawSelect("roles", { where: { name: "seller" } }, ["id"]),
      queryInterface.rawSelect("roles", { where: { name: "buyer" } }, ["id"])
    ]);

    if (!adminRole || !userRole) {
      throw new Error("Roles 'admin' and/or 'user' not found in Role table.");
    }
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          firstName: "Emmanuel-user",
          googleId: "tttttttttttt",
          lastName: "munezero",
          email: "test1ssd@gmail.com",
          password:
            "$2b$12$Kq9AzP89EFaDgNmxh7RrjOl.b0WI7x.mb9epID2lFZfa0VQNUk3rG",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          roleId: userRole,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Prince-admin",
          lastName: "Rwigimba",
          googleId: "tttttttttttt",
          email: "princerwigimbdsdsa@gmail.com",
          password:
            "$2b$12$Kq9AzP89EFaDgNmxh7RrjOl.b0WI7x.mb9epID2lFZfa0VQNUk3rG",
          phone: "+250784948614",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          roleId: adminRole,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel-seller",
          googleId: "tttttttttttt",
          lastName: "munezero",
          email: "tes2t322@gmail.com",
          password:
            "$2b$12$Kq9AzP89EFaDgNmxh7RrjOl.b0WI7x.mb9epID2lFZfa0VQNUk3rG",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          roleId: sellerRole,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel-buyer",
          lastName: "munezero",
          email: "testsasas5@gmail.com",
          password:
            "$2b$12$Kq9AzP89EFaDgNmxh7RrjOl.b0WI7x.mb9epID2lFZfa0VQNUk3rG",
          googleId: "tttttttttttt",
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
          email: "test320@gmail.com",
          password:
            "$2b$12$Kq9AzP89EFaDgNmxh7RrjOl.b0WI7x.mb9epID2lFZfa0VQNUk3rG",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          roleId: userRole,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  }
};
