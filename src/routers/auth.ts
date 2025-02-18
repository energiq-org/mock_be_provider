import { Router } from 'express'
import { body } from 'express-validator';
import loginController from '../controllers/login';
import validateRequest from '../middlewares/validator';

const router: Router = Router()

router.post('/login', [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid Emaild')
        .trim(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password should be atleast 6 characters long')
    ],
    validateRequest,
    loginController);



export default router;