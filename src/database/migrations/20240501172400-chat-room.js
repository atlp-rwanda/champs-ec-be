module.exports = {
  async up(queryInterface, Sequelize) {
    // Recreate chatrooms table
    await queryInterface.createTable("chatrooms", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      initiator: {
        type: Sequelize.UUID,
        allowNull: false
      },
      participants: {
        type: Sequelize.ARRAY(Sequelize.JSON()),
        allowNull: false
      },
      isPrivate: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("chatrooms");
  }
};
