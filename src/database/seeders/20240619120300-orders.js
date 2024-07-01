// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "orders",
      [
        {
          id: uuidv4(),
          buyerId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "8c1d2ace-f8b7-4e80-b966-7877b2fcf182",
          quantity: 30,
          totalAmount: 12,
          isPaid: false,
          paymentDate: new Date(),
          deliveryDate: new Date(),
          deliveryStatus: "Delivered",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          buyerId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "0e75be1a-762e-439f-af10-4a78a03ea635",
          quantity: 10,
          totalAmount: 220,
          isPaid: false,
          paymentDate: new Date(),
          deliveryDate: new Date(),
          deliveryStatus: "Delivered",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          buyerId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "c8bec8f8-eeeb-47d1-89f0-0cb1b504694d",
          quantity: 20,
          totalAmount: 120,
          isPaid: false,
          paymentDate: new Date(),
          deliveryDate: new Date(),
          deliveryStatus: "Shipped",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          buyerId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "075b82f8-f50b-4a7a-9309-c536cfafbeff",
          quantity: 20,
          totalAmount: 12,
          isPaid: true,
          paymentDate: new Date(),
          deliveryDate: new Date(),
          deliveryStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          buyerId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "bc041af6-a5da-407f-81ea-2b2b8f095f6d",
          quantity: 40,
          totalAmount: 12,
          isPaid: true,
          paymentDate: new Date(),
          deliveryDate: new Date(),
          deliveryStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          buyerId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "c83a7eeb-3781-4235-83bb-29f19b385068",
          quantity: 20,
          totalAmount: 12,
          isPaid: true,
          paymentDate: new Date(),
          deliveryDate: new Date(),
          deliveryStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: uuidv4(),
          buyerId: "28f676ce-82e0-43e3-870b-e692127b0b89",
          productId: "bcf8591d-2ab0-4364-88f2-a419650f927e",
          quantity: 2,
          totalAmount: 2,
          isPaid: true,
          paymentDate: new Date(),
          deliveryDate: new Date(),
          deliveryStatus: "Delivered",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("orders", null, {});
  }
};
