import * as Yup from 'yup';
import { startOfHour, isBefore, parseISO } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class NewAppointmentController {
  async update(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // find the provider
    const provider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!provider) {
      return res
        .status(400)
        .json({ error: 'This ID does not belongs to a provider' });
    }

    // Verify if date is correct
    const hourDate = startOfHour(parseISO(date));
    if (isBefore(hourDate, new Date())) {
      return res
        .status(400)
        .json({ error: 'Date need to be in the future...' });
    }

    // Verify if date wasn't already taken
    const appointmentDateExists = await Appointment.findOne({
      where: { date: hourDate, provider_id, canceled_at: null },
    });
    if (appointmentDateExists) {
      return res.status(400).json({ error: 'This data was already taken' });
    }

    const appointment = await Appointment.create({
      date: hourDate,
      provider_id,
      user_id: req.userId,
    });

    return res.json(appointment);
  }
}

export default new NewAppointmentController();
