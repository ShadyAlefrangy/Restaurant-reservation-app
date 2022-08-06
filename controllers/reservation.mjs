import { Reservation } from "../models/reservation.mjs";

export async function getREservation(req, res, next) {
    const restaurantId = req.session.restaurantId;
    const times = await Reservation.find({ restaurant: restaurantId }).select({ "time": 1, "_id": 0});
    const reservedTimes = [];
    for (let i = 0; i < times.length; i++) {
        reservedTimes.push(times[i].time);
    }
    const availableTimes = [];
    for (let i = 12; i < 24; i++) {
        const time = i + ':00' + ' - ' + (i + 1) + ':00';
        if (!reservedTimes.includes(time)) {
            availableTimes.push(time);
        }
    }

    res.render('reservation/create-reservation', {
        pageTitle: "Create Reservation",
        formCSS: true,
        productCSS: true,
        activeAddProduct: true,
        availableTimes: availableTimes,
        minDate: new Date(),
        maxDate: new Date()
    });
}

export async function postReservation(req, res, next) {
    const restaurantId = req.session.restaurantId;
    const userId = req.session.user._id;

    const reservation = new Reservation({
        user: userId,
        restaurant: restaurantId,
        date: req.body.date,
        time: req.body.time,
        notes: req.body.notes
    });
    await reservation.save();
    res.redirect('/');

}

export async function getAllMyReservations(req, res, next) {
    const userId = req.session.user._id;
    const reservations = await Reservation.find({ user: userId}).populate('restaurant');
    res.render('reservation/my-reservations', {
        pageTitle: "My Reservation",
        formCSS: true,
        productCSS: true,
        activeReservation: true,
        reservations: reservations,
        hasReservations: reservations.length > 0
    });
}

export async function cancelReservation(req, res, next) {
    console.log(req.params.reservationId);
    const reservation = await Reservation.findById(req.params.reservationId)
    reservation.delete();
    res.redirect('/my-reservations');
}