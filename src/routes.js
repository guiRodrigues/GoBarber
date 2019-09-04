// importar somente o router do express
import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// instância de um middleware?
const upload = multer(multerConfig);

// Passando o middleware UserController
routes.get('/users', UserController.index); // List all users
routes.post('/users', UserController.store); // Create user
routes.post('/sessions', SessionController.store); // Create session

routes.use(authMiddleware);

routes.put('/users', UserController.update); // Update user

routes.get('/providers', ProviderController.index); // List all user providers

routes.post('/files', upload.single('file'), FileController.store); // Store an image

export default routes;
