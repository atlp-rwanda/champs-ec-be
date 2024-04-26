// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          firstName: "Emmanuel",
          lastName: "munezero",
          email: "test33@gmail.com",
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

    const selectedUsers = await queryInterface.sequelize.query(
      `SELECT id from USERS;`
    );
    const selectedCategory = await queryInterface.sequelize.query(
      `SELECT id from product_categories;`
    );
    const userRow = selectedUsers[0];
    const category = selectedCategory[0];

    await queryInterface.bulkInsert(
      "products",
      [
        {
          id: uuidv4(),
          sellerId: userRow[0].id,
          productName: "test Product",
          stockLevel: "100 kg",
          productCategory: category[0].id,
          productPrice: "100",
          productCurrency: "BUD",
          productDiscount: "0",
          isAvailable: false,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dbbv6uvfu/image/upload/v1712563210/ilezp3vjo7gcirzofy2t.jpg",

          expireDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          isExpired: false
        },
        {
          id: uuidv4(),
          sellerId: userRow[0].id,
          productName: "test Product2",
          stockLevel: "100 kg",
          productCategory: category[1].id,
          productPrice: "300",
          productCurrency: "BUD",
          productDiscount: "0",
          isAvailable: false,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dbbv6uvfu/image/upload/v1712563210/ilezp3vjo7gcirzofy2t.jpg",

          expireDate: "2028-01-10",
          createdAt: new Date(),
          updatedAt: new Date(),
          isExpired: false
        },
        {
          id: uuidv4(),
          sellerId: userRow[0].id,
          productName: "test Product3",
          stockLevel: "100 kg",
          productCategory: category[2].id,
          productPrice: "500",
          productCurrency: "BUD",
          productDiscount: "0",
          isAvailable: false,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dbbv6uvfu/image/upload/v1712563210/ilezp3vjo7gcirzofy2t.jpg",

          expireDate: "2028-01-10",
          createdAt: new Date(),
          updatedAt: new Date(),
          isExpired: false
        },
        {
          id: uuidv4(),
          sellerId: userRow[0].id,
          productName: "test Product2",
          stockLevel: "100 kg",
          productCategory: category[0].id,
          productPrice: "200",
          productCurrency: "BUD",
          isAvailable: false,
          productDiscount: "0",
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dbbv6uvfu/image/upload/v1712563210/ilezp3vjo7gcirzofy2t.jpg",

          expireDate: "2024-03-03",
          createdAt: new Date(),
          updatedAt: new Date(),
          isExpired: false
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("products", null, {});
  }
};
