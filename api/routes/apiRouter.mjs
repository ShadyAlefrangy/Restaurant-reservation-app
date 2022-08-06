import express from "express";
import { authApiRouter } from "./auth.mjs";
import { reservationApiRouter } from "./reservation.mjs";
import { restaurantApiRouter } from "./restaurant.mjs";


export const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.use('/auth', authApiRouter);
apiRouter.use('/restaurants', restaurantApiRouter);
apiRouter.use('/reservations', reservationApiRouter);