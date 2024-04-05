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
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685571/champs-bay/ifo2me0najmr3n152qr9.png",
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
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685569/champs-bay/gwghcdjn5ntnokhwhp1s.avif",
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
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685569/champs-bay/gwghcdjn5ntnokhwhp1s.avif",
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
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685570/champs-bay/z9wuqvijnb2l4zctwwli.webp",
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Jack",
          lastName: "Doe",
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
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685571/champs-bay/uiozbejwbplfl4c0pxus.webp",
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
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685571/champs-bay/uiozbejwbplfl4c0pxus.webp",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Kanuma",
          lastName: "castro",
          email: "usertest@gmail.com",
          password:
            "$2b$12$Kq9AzP89EFaDgNmxh7RrjOl.b0WI7x.mb9epID2lFZfa0VQNUk3rG",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          roleId: adminRole,
          verified: true,
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685569/champs-bay/gwghcdjn5ntnokhwhp1s.avif",
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
