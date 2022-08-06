import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.mjs";

export async function signup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    try {
        const email = req.body.email;
        const password = req.body.password;
        const phone_number = req.body.phone_number;
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = new User({
            email: email,
            password: hashedPassword,
            phone_number: phone_number
        });
        const newUser = await user.save();
        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

export async function login(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 401;
        throw error;
    }
    const validatedPassword = await bcrypt.compare(password, user.password);
    if (!validatedPassword) {
        const error = new Error('Wrong Password');
        error.statusCode = 401;
        throw error;
    }
    const token = jwt.sign({
        email: user.email,
        userId: user._id.toString()
    }, 'secret', { expiresIn: '1h'});

    res.status(200).json({
        token: token,
        userId: user._id.toString()
    });
}