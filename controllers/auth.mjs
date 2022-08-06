import { User } from "../models/user.mjs";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

export function getLogin(req, res, next) {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        activeLogin: true,
        pageTitle: "Login Page",
        formCSS: true,
        authCSS: true,
        isAuthenticated: false,
        errorMessage: message
    });
}

export async function postLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
    }
    const validatedPassword = await bcrypt.compare(password, user.password);
    if (validatedPassword) {
        req.session.loggedIn = true;
        req.session.user = user;
        req.session.save();
        res.redirect('/');
    } else {
        req.flash('error', 'Invalid email or password');
        res.redirect('/login');
    }
}
export async function getSignup(req, res, next) {
    res.render('auth/signup', {
        activeSignUp: true,
        pageTitle: "SignUp Page",
        formCSS: true,
        authCSS: true,
        isAuthenticated: false,
        oldInput: {email: '', password: '', confirmPassword: ''},
        validationsErrors: []
    });
}

export async function postSignup(req, res, next) {
    try {
        const email = req.body.email;
        const phone_number = req.body.phone_number;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const errors = validationResult(req);
        const validationsErrors = errors.array();
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/signup', {
                activeSignUp: true,
                pageTitle: "SignUp Page",
                formCSS: true,
                authCSS: true,
                isAuthenticated: false,
                errorMessage: errors.array()[0],
                oldInput: { email: email, phone_number: phone_number, password: password },
                emailValidationError: validationsErrors.find(e => e.param === 'email'),
                phoneNumberValidationError: validationsErrors.find(e => e.param === 'phone_number'),
                passwordValidationError: validationsErrors.find(e => e.param === 'password')
            });
        }
    
        const user = new User({
            email: email,
            phone_number: phone_number,
            password: hashedPassword,
        });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/signup');
    }
}