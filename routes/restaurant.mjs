import express from "express";
import { getIndex, getRestaurant } from "../controllers/restaurant.mjs";

export const restaurantRouter = express.Router();

restaurantRouter.get('/', getIndex);

restaurantRouter.get('/restaurants/:restaurantId', getRestaurant);
