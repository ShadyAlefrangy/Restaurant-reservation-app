import { Restaurant } from "../../models/restaurant.mjs";
import { validationResult } from "express-validator";
import { Reservation } from "../../models/reservation.mjs";

export async function getAllRestaurants(req, res, next) {
    try {
        // let fields;
        let restaurants;
        // if (req.query.fields) {
        //     fields = (req.query.fields).split(",");
        // }
        const currentPage = req.query.page || 1;
        const perPage = 1;
        let totalItems;
        totalItems = await Restaurant.find().countDocuments();
        if (req.query) {
            restaurants = await Restaurant.find(req.query).skip((currentPage - 1) * perPage).limit(perPage);
        } else {
            restaurants = await Restaurant.find().skip((currentPage - 1) * perPage).limit(perPage);
        }
        res.status(200).json({
            restaurants: restaurants,
            totalItems: totalItems
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

export async function getRestaurant(req, res, next) {
    const restaurantId = req.params.restaurantId;
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            const error = new Error('Could not find the restaurant');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: "Restaurant fetched.",
            restaurant: restaurant
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

export async function createRestaurant(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed, entered data is invalid');
        error.statusCode = 422;
        throw error;
    }
    if (req.file) {
        console.log(req.file.filename);
        const fileName = req.file.filename;
        return res.json({
            image_url: `http://localhost:3000/images/${fileName}`
        });
    }
    const name = req.body.name;
    const category = req.body.category;
    const city = req.body.city;
    const img = req.file.path;
    // console.log(imageUrl.replace('\\', '/'));
    try {
        const restaurant = new Restaurant({
            name: name, 
            category: category,
            city: city,
            img: img
        });
        const newRestaurant = await restaurant.save();
        res.status(201).json({
            message: "Restaurant created successfully",
            restaurant: newRestaurant,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

export async function createReservation(req, res, next) {
    const restaurantId = req.params.restaurantId;
    const userId = req.userId;
    const times = await Reservation.find().select({ "time": 1, "_id": 0});
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
    if (!availableTimes.includes(req.body.time)) {
        const error = new Error('This time is already reserved');
        error.statusCode = 401;
        throw error;
    }
    const reservation = new Reservation({
        user: userId,
        restaurant: restaurantId,
        date: new Date(),
        time: req.body.time,
        notes: req.body.notes
    });
    const newReservation = await reservation.save();
    res.status(201).json({
        message: "Restaurant created successfully",
        reservation: newReservation,
    });
}

export async function getRestaurantSchedule(req, res, next) {
    const times = await Reservation.find({ restaurant: req.params.restaurantId}).select({ "time": 1, "_id": 0});
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
    res.status(200).json({
        available: availableTimes,
    });
}
