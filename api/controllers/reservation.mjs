import { Reservation } from "../../models/reservation.mjs";

export async function getReservationForUser(req, res, next) {
    const userId = req.params.userId;
    try {
        const reservations = await Reservation.find({ user: userId});
        if (reservations.length == 0) {
            return res.status(200).json({
                message: "No reservations for this user",
            });
        }

        res.status(200).json({
            message: "Reservations fetched.",
            reservations: reservations
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

export async function deleteReservation(req, res, next) {
    const reservationId = req.params.reservationId;
    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            const error = new Error('Could not find the reservation');
            error.statusCode = 404;
            throw error;
        }
        
        await reservation.delete();
        res.status(200).json({
            message: "Reservation deleted successfully"
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }


}