// eslint-disable-next-line @typescript-eslint/no-var-requires
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
        type: Sequelize.STRING,
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

    await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION public.products_notify_trigger() RETURNS TRIGGER AS $$
    BEGIN
      PERFORM pg_notify('update_notification',row_to_json(NEW)::text);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `);
    await queryInterface.sequelize.query(`
    CREATE TRIGGER product_update_trigger AFTER UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.products_notify_trigger();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
    DROP TRIGGER IF EXISTS product_update_trigger ON public.products;
    `);
    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS public.products_notify_trigger();
    `);
    await queryInterface.dropTable("products");
  }
};
