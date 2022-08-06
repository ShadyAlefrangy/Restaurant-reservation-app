import { Restaurant } from "../models/restaurant.mjs";

export async function getIndex(req, res, next) {
    console.log(req.body);
    const restaurants = await Restaurant.find();
    res.render('restaurant/index', {
        hasRestaurants: restaurants.length > 0,
        restaurants,
        activeRestaurant: true,
        productCSS: true,
        pageTitle: "All Restaurants",
    });
}

export async function getRestaurant(req, res, next) {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findById(restaurantId);
    req.session.restaurantId = restaurant._id;
    res.render('restaurant/restaurant-details', {
        restaurant: restaurant,
        activeProducts: true,
        pageTitle: restaurant.title,
    });
}