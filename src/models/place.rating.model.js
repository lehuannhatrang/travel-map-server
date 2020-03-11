import createSchema from "../schema/base.schema";
import mongoose from "mongoose";
import {PlaceRatingSchema} from "../schema/place.rating.schema";

const placeRatingSchema = createSchema(PlaceRatingSchema, false, 'place_rating');

export default mongoose.model('PlaceRating', placeRatingSchema);

