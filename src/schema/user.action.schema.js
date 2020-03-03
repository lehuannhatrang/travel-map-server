import {Schema} from "mongoose";

export const UserActionSchema = {
    type: {
        type: String,
        enum: ['CREATE', 'UPDATE', 'DELETE']
    },

    collectionName: {
        type: String,
        trim: true
    },

    diff: {
        type: [Schema.Types.Mixed],
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
}