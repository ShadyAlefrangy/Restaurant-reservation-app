import express from "express";
import { User } from "../../models/user.mjs";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { login, signup } from "../controllers/auth.mjs";

export const authApiRouter = express.Router();

authApiRouter.post('/signup', [
    body('email').isEmail().withMessage('Please enter valid email').custom(async (value, { req }) => {
        const user = await User.findOne({ email: value});
        if (user) {
            throw Error('This email already exists');
        }
    }).normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    
], signup);

authApiRouter.post('/login', login);