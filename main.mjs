import express from "express";
import { dbConnect } from "./util/db-connect.mjs";
import hbs from "hbs";
import { authRouter } from "./routes/auth.mjs";
import path from "path";
import { getSignup } from "./controllers/auth.mjs";
import csurf from "csurf";
import session from "express-session";
import { default as connectMongoDBSession} from "connect-mongodb-session";
import flash from "connect-flash";
import { restaurantRouter } from "./routes/restaurant.mjs";
import { reservationRouter } from "./routes/reservation.mjs";
import { apiRouter } from "./api/routes/apiRouter.mjs";
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const app = express();
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
    uri: 'mongodb+srv://shady:********@cluster0.4rv4jja.mongodb.net/?retryWrites=true&w=majority',
    collection: 'sessions'
});
dbConnect();
const csrfProtection = csurf();
app.use(flash());
app.set('view engine', 'hbs');
app.set('views', 'views');
hbs.registerPartials('./views/partials');
app.use(express.urlencoded({extended: true}));
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.resolve('./public')));
// session
app.use(session({
    secret: "my secret", 
    resave: false, 
    saveUninitialized: false,
    store: store
}));
app.use('/api', apiRouter);
// csrf protection
app.use(csrfProtection);

hbs.localsAsTemplateData(app);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.loggedIn;
    res.locals.csrfToken = req.csrfToken();
    app.locals.csrfToken = req.csrfToken();
    next();
});

// Routes
app.use(authRouter);
app.use(restaurantRouter);
app.use(reservationRouter);

// app.use('/', getSignup);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});