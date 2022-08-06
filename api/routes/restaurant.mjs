import express from "express";
import { createReservation, createRestaurant, getAllRestaurants, getRestaurant, getRestaurantSchedule } from "../controllers/restaurant.mjs";
import multer from "multer";
import { isAuth } from "../middleware/isAuth.mjs";

const storage = multer.diskStorage({
    destination: './public/images',
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1000 * 1000
    }
});


export const restaurantApiRouter = express.Router();

restaurantApiRouter.get('/index', getAllRestaurants);
restaurantApiRouter.get('/:restaurantId', getRestaurant);
restaurantApiRouter.post('/create', upload.single("img"), createRestaurant);
restaurantApiRouter.post('/:restaurantId/reservations/create', isAuth , createReservation);
restaurantApiRouter.get('/:restaurantId/schedule', getRestaurantSchedule);



