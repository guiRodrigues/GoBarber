import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // Essa variável 'sequelize' passada como parâmetro do init é a conexão
  // feita no arquivo index.js em database
  static init(sequelize) {
    // Enviar as colunas no método init (apenas as que serão 'inseridas pelo usuário')
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        // this attribute is only for this code
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'users',
        // mais informações sobre a tabela
      }
    );

    // Hooks (also known as lifecycle events), are functions which
    // are called before and after calls in sequelize are executed.
    // For example, if you want to always set a value on a model before saving it, you can add a beforeUpdate hook.
    // This code will be executed before every user saved '-'
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    // Return the model that was initialized here.
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
