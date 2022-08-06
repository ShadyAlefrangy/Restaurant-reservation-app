import express from "express";
import { getLogin, getSignup, postLogin, postSignup } from "../controllers/auth.mjs";
import { check, body } from "express-validator";

export const authRouter = express.Router();

authRouter.get('/login', getLogin);
authRouter.post('/login', postLogin);
// router.post('/logout', postLogout);
authRouter.get('/signup', getSignup);
authRouter.post('/signup', [ 
    body('email', 'Please enter tha valid email.').isEmail().normalizeEmail(),
    body('password', 'Please enter a password with only text and password at least 5 characters').isLength({ min: 5 }).isAlphanumeric()
    
], postSignup);