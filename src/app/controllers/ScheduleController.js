import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';
// import File from '../models/File';

class ScheculeController {
  async index(req, res) {
    // const { page = 1 } = req.query;
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!isProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const schedules = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
      },
      order: ['date'],
      // attributes: ['id', 'date'],
      // limit: 3,
      // offset: (page - 1) * 3,
      // include: [
      //   {
      //     model: User,
      //     as: 'provider',
      //     attributes: ['id', 'name'],
      //     include: [
      //       {
      //         model: File,
      //         as: 'avatar',
      //         attributes: ['id', 'path', 'url'],
      //       },
      //     ],
      //   },
      // ],
    });

    return res.json(schedules);
  }
}

export default new ScheculeController();
