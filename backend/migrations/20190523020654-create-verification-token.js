

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('verificationTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade',
        references: { model: 'users', key: 'id' }
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.sequelize.query(`
      CREATE EVENT expireToken
      ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
      DO
      DELETE FROM verificationTokens where createdAt < DATE_SUB(NOW(), INTERVAL 1 DAY);
    `);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('verificationTokens');
    await queryInterface.sequelize.query('DROP EVENT IF EXISTS expireToken');
  }
};
