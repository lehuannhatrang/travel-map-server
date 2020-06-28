import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import {UserCriteriaSchema} from "../schema/user.criteria.schema";

const userCriteriaSchema = createSchema(UserCriteriaSchema, false, 'user_criteria');


export default mongoose.model('UserCriteria', userCriteriaSchema);