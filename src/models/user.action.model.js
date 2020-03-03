import mongoose from 'mongoose';
import createSchema from "../schema/base.schema";
import { UserActionSchema } from "../schema/user.action.schema";

const userActionSchema = createSchema(UserActionSchema, false, 'user_actions');

export default mongoose.model('UserAction', userActionSchema);