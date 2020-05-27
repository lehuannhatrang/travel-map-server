import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import { UserRatingSchema } from "../schema/user.rating.schema";

const userRatingSchema = createSchema(UserRatingSchema, false, 'user_rating');

export default mongoose.model('UserRating', userRatingSchema);