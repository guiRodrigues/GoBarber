// Para armazenar as imagens é preciso de uma nova tabela no banco
// yarn sequelize migration:create --name=create-files
// yarn sequelize db:migrate
// ? Por que não salvar as imagens como atributos na tabela user?

// depois de importar o model de file no index do database, posso prosseguir...
import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { file } = await File.create({ name, path });
    return res.json(file);
  }
}

export default new FileController();
