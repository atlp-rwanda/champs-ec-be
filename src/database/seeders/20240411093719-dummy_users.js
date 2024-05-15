// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    const [adminRole, sellerRole, buyerRole] = await Promise.all([
      queryInterface.rawSelect("roles", { where: { name: "admin" } }, ["id"]),
      queryInterface.rawSelect("roles", { where: { name: "seller" } }, ["id"]),
      queryInterface.rawSelect("roles", { where: { name: "buyer" } }, ["id"])
    ]);

    if (!adminRole || !buyerRole) {
      throw new Error("Roles 'admin' and/or 'user' not found in Role table.");
    }
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          firstName: "Tchami-user",
          googleId: "tttttttttttt",
          lastName: "Ernest",
          email: "test1ssd@gmail.com",
          password:
            "$2b$12$Kq9AzP89EFaDgNmxh7RrjOl.b0WI7x.mb9epID2lFZfa0VQNUk3rG",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685572/champs-bay/v5tavmwxhfhwh39g69t6.jpg",
          verified: true,
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
            "$2b$12$rxJ3wPROdtwr3qwZsmTvZu1/BANGTnJDrVj3MzU8tiEAf590IGvHW",
          phone: "+250784948614",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685569/champs-bay/vvmqa2pkounwqiprthyi.jpg",
          verified: true,
          roleId: adminRole,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Prince-seller",
          lastName: "Rwigimba",
          googleId: "tttttttttttt",
          email: "princerwigimba07@gmail.com",
          password:
            "$2b$12$rxJ3wPROdtwr3qwZsmTvZu1/BANGTnJDrVj3MzU8tiEAf590IGvHW",
          phone: "+250784948614",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685569/champs-bay/qw6bgjgnianvnricukoj.jpg",
          verified: true,
          roleId: sellerRole,
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
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685571/champs-bay/ifo2me0najmr3n152qr9.png",
          roleId: sellerRole,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Kayigamba",
          lastName: "Blair",
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
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685569/champs-bay/d4nvhosigmhtyedrzptv.jpg",
          verified: true,
          roleId: buyerRole,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Ishimwe",
          lastName: "Ami Paradis",
          email: "test320@gmail.com",
          password:
            "$2b$12$Kq9AzP89EFaDgNmxh7RrjOl.b0WI7x.mb9epID2lFZfa0VQNUk3rG",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685571/champs-bay/vfi1i3zbgezamuhllqhp.jpg",
          roleId: buyerRole,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Kanuma",
          lastName: "castro",
          email: "usertest01@gmail.com",
          password:
            "$2b$12$2H3GdKcr6rssPL22f733r.hJ0xEj3D1UakI8JzIZEuJHj6wSime3m",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685570/champs-bay/zboxklwsbv7a5ppadsto.jpg",
          verified: true,
          roleId: buyerRole,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Kanuma",
          lastName: "castro",
          email: "usertest02@gmail.com",
          password:
            "$2b$12$2H3GdKcr6rssPL22f733r.hJ0xEj3D1UakI8JzIZEuJHj6wSime3m",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685569/champs-bay/kwkrrgedyqtbfy1i2tr7.jpg",
          verified: true,
          roleId: buyerRole,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: "Brice",
          lastName: "Ntirushwa",
          email: "ntirushwa02@gmail.com",
          password:
            "$2b$12$2H3GdKcr6rssPL22f733r.hJ0xEj3D1UakI8JzIZEuJHj6wSime3m",
          phone: "+250786534345",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685571/champs-bay/ifo2me0najmr3n152qr9.png",
          verified: true,
          roleId: buyerRole,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          firstName: process.env.PUBLIC_CHATROOM_FIRSTNAME,
          lastName: process.env.PUBLIC_CHATROOM_LASTNAME,
          email: process.env.EMAIL_USERNAME,
          password:
            "$2b$12$2H3GdKcr6rssPL22f733r.hJ0xEj3D1UakI8JzIZEuJHj6wSime3m",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          whereYouLive: "kigali street KN 250 st",
          billingAddress: "kigali street KN 250 st",
          profileImage:
            "https://res.cloudinary.com/drno4jopp/image/upload/v1715685571/champs-bay/eqtqsw2blvuy6acvlvzr.jpg",
          verified: true,
          roleId: adminRole,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  }
};
