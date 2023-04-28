import * as express from 'express';
import { AuthController } from '../controllers';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

export default router;
