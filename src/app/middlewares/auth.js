import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Token example:
  // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNTY3MTM1NjIxLCJleHAiOjE1Njc3NDA0MjF9.UcRuH4UQO_01grKYFlwYibxSv5HU6cSmLyMjUzZOks8
  // Porém eu só quero o token de fato
  const [, token] = authHeader.split(' ');

  try {
    // Através do decoded, eu tenho acesso ao payload passado na criação do token
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
