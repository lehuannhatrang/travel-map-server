import Schema from "mongoose";

export const UserInfoSchema = {
    phones: [String],
    displayName: String,
    role: {
        type: String,
        require: true
    },

    mail: {
        type: String,
        unique: true
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
}