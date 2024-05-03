/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      buyerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "products", key: "id" },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      paymentDate: {
        type: Sequelize.DATE
      },
      deliveryDate: {
        type: Sequelize.DATE
      },
      deliveryStatus: {
        type: Sequelize.ENUM("Pending", "Shipped", "Delivered"),
        allowNull: false,
        defaultValue: "Pending"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("orders");
  }
};
