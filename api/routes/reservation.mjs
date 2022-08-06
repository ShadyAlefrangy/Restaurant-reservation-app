import express from "express";
import { deleteReservation, getReservationForUser } from "../controllers/reservation.mjs";

export const reservationApiRouter = express.Router();

reservationApiRouter.get('/:userId', getReservationForUser);
reservationApiRouter.delete('/:reservationId', deleteReservation);