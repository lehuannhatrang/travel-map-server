import createSchema from "../schema/base.schema";
import mongoose from "mongoose";
import {UserInfoSchema} from "../schema/user.info.schema";

const userInfoSchema = createSchema(UserInfoSchema, false, 'user_info');

userInfoSchema.statics.getByUserId = async function (userId) {
    let result = await this.findOne({user: userId}).exec();
    return result ? result.toObject() : null;
}
export default mongoose.model('UserInfo', userInfoSchema);

