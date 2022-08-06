import express, { application } from "express";
import { cancelReservation, getAllMyReservations, getREservation, postReservation } from "../controllers/reservation.mjs";

export const reservationRouter = express.Router();

reservationRouter.get('/reservation', getREservation);
reservationRouter.post('/reservation', postReservation);
reservationRouter.get('/my-reservations', getAllMyReservations);
reservationRouter.post('/my-reservations/:reservationId', cancelReservation);