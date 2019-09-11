import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class NewSchedule {
  async index(req, res) {
    // Check if user is a provider
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!isProvider) {
      return res.status(401).json({ error: 'This user is not a provider' });
    }

    // Check if the date passed by params is valid
    const { date } = req.query;
    const parsedDate = parseISO(date);
    const schedules = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
      },
      order: ['date'],
    });
    return res.json(schedules);
  }
}

export default NewSchedule;
