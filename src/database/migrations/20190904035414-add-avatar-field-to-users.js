// migration para adicionar a coluna referente a files na tabela de users;

module.exports = {
  up: (queryInterface, Sequelize) => {
    // name of SOURCE model  /  name of the key we're adding
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'files', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
