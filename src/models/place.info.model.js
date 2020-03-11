import createSchema from "../schema/base.schema";
import mongoose from "mongoose";
import {PlaceInfoSchema} from "../schema/place.info.schema";

const placeInfoSchema = createSchema(PlaceInfoSchema, false, 'place_info');

export default mongoose.model('PlaceInfo', placeInfoSchema);

