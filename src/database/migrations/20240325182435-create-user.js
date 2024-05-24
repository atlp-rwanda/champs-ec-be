/** @type {import('sequelize-cli').Migration} */

const extendPasswordValidity = async () => {
  let myDate = new Date(Date.now());
  const addedTime = Number(process.env.PASSWORD_LIFE_SPAN);
  myDate = new Date(myDate.setMonth(myDate.getMonth() + addedTime));
  return myDate;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      birthDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      preferredLanguage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      preferredCurrency: {
        type: Sequelize.STRING,
        allowNull: true
      },
      billingAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      whereYouLive: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: ""
      },
      verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      roleId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "roles",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      reasonForDeactivation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      passwordExpiresAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: await extendPasswordValidity()
      },
      isPasswordExpired: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  }
};
