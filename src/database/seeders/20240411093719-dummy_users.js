// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    const [adminRole, sellerRole, buyerRole] = await Promise.all([
      queryInterface.rawSelect("roles", { where: { name: "admin" } }, ["id"]),
      queryInterface.rawSelect("roles", { where: { name: "seller" } }, ["id"]),
      queryInterface.rawSelect("roles", { where: { name: "buyer" } }, ["id"])
    ]);

    if (!adminRole || !buyerRole || !sellerRole) {
      throw new Error(
        "Roles ,'admin' or  'buyer' or 'seller' not found in Role table."
      );
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
          roleId: buyerRole,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Prince-admin",
          lastName: "Rwigimba",
          googleId: "tttttttttttt",
          email: "princerwigimba@gmail.com",
          password:
            "$2b$12$b87PcckZ2LrQYa.7epI6RulBbXx1yAq7R5xDnh7lb8uD6LKkIPmey",
          phone: "+250784948614",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          roleId: adminRole,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "janet",
          googleId: "tttttttttttt",
          lastName: "barbie",
          email: "uwimanajanet563@gmail.com",
          password:
            "$2b$12$pbHJg2PczT/OB3NVEOTVT.d9cIZxTGY9FrIz4RjyqJcqVAZCCIjqe",
          phone: "+250783727445",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage: "test.png",
          roleId: sellerRole,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel-buyer",
          lastName: "munezero",
          email: "test54@gmail.com",
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
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "testwde24@gmail.com",
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
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  }
};
