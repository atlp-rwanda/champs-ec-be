const sequelize = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      sellerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      productCategory: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "product_categories", key: "id" },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stockLevel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      productCurrency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productDiscount: {
        type: Sequelize.STRING,
        allowNull: false,
        default: 0
      },
      productDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      productThumbnail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productPictures: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        allowNull: true
      },
      isAvailable: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      expireDate: {
        type: Sequelize.DATE,
        allowNull: null
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      isExpired: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("products");
  }
};
