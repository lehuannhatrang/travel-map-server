import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import { TripRecommendUserSchema } from "../schema/tripRecomend.user.schema";

const tripRecommendUserSchema = createSchema(TripRecommendUserSchema, false, 'trip_recommender_user');

export default mongoose.model('tripRecommendUser', tripRecommendUserSchema);