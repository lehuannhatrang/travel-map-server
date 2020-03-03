import createSchema from "../schema/base.schema";
import mongoose from "mongoose";
import {RestaurantInfoSchema} from "../schema/restaurant.info.schema";

const restaurantInfoSchema = createSchema(RestaurantInfoSchema, false, 'restaurant_info');

export default mongoose.model('RestaurantInfo', restaurantInfoSchema);

