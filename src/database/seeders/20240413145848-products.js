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
          password:
            "$2b$12$Alp9r553SHLbOWXbtJfl.O40EAzAZQEfvspOXLX1Xoo08ZKCTnF4i",
          phone: "+250786534332",
          birthDate: new Date(),
          preferredLanguage: "kinyarwanda",
          preferredCurrency: "$",
          verified: true,
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
          id: "8c1d2ace-f8b7-4e80-b966-7877b2fcf182",
          sellerId: userRow[1].id,
          productName: "SKIRTS",
          stockLevel: 270,
          productCategory: category[0].id,
          productPrice: "4500",
          productCurrency: "RWF",
          productDiscount: 0,
          isExpired: false,
          isAvailable: true,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dmems8p0a/image/upload/v1708286842/samples/ecommerce/accessories-bag.jpg",

          expireDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          isExpired: false
        },
        {
          id: "0e75be1a-762e-439f-af10-4a78a03ea635",
          sellerId: userRow[0].id,
          productName: "test Product20",
          stockLevel: 100,
          productCategory: category[1].id,
          productPrice: 200.0,
          productCurrency: "BUD",
          productDiscount: 0,
          isAvailable: false,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dmems8p0a/image/upload/v1708286842/samples/ecommerce/accessories-bag.jpg",
          isExpired: false,
          expireDate: "2028-01-10",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "c8bec8f8-eeeb-47d1-89f0-0cb1b504694d",
          sellerId: userRow[1].id,
          productName: "SUIT",
          stockLevel: 49,
          productCategory: category[0].id,
          productPrice: "65000",
          productCurrency: "RWF",
          productDiscount: 0,
          isExpired: false,
          isAvailable: true,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dmems8p0a/image/upload/v1708286842/samples/ecommerce/accessories-bag.jpg",

          expireDate: "2028-01-10",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "075b82f8-f50b-4a7a-9309-c536cfafbeff",
          sellerId: userRow[2].id,
          productName: "SHOES",
          stockLevel: 175,
          productCategory: category[0].id,
          productPrice: 17000,
          productCurrency: "RWF",
          productDiscount: 0,
          isExpired: false,
          isAvailable: true,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dmems8p0a/image/upload/v1708286842/samples/ecommerce/accessories-bag.jpg",

          expireDate: "2024-01-10",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "bc041af6-a5da-407f-81ea-2b2b8f095f6d",
          sellerId: userRow[2].id,
          productName: "DRESSES",
          stockLevel: 100,
          productCategory: category[0].id,
          productPrice: 9000,
          productCurrency: "RWF",
          productDiscount: 0,
          isExpired: false,
          isAvailable: true,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dmems8p0a/image/upload/v1708286842/samples/ecommerce/accessories-bag.jpg",

          expireDate: "2028-01-10",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "c83a7eeb-3781-4235-83bb-29f19b385068",
          sellerId: userRow[3].id,
          productName: "Pens",
          stockLevel: 500,
          productCategory: category[0].id,
          productPrice: 50,
          productCurrency: "RWF",
          productDiscount: 0,
          isExpired: false,
          isAvailable: true,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dmems8p0a/image/upload/v1708286842/samples/ecommerce/accessories-bag.jpg",

          expireDate: "2028-01-10",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "bcf8591d-2ab0-4364-88f2-a419650f927e",
          sellerId: userRow[3].id,
          productName: "Cup",
          stockLevel: 1000,
          productCategory: category[0].id,
          productPrice: 200,
          productCurrency: "RWF",
          productDiscount: 0,
          isExpired: false,
          isAvailable: true,
          productDescription:
            "test of project implementation product item crud",
          productThumbnail:
            "https://res.cloudinary.com/dmems8p0a/image/upload/v1708286842/samples/ecommerce/accessories-bag.jpg",

          expireDate: "2028-01-10",
          createdAt: new Date(),
          updatedAt: new Date()
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
