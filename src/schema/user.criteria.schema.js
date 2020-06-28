import Schema from "mongoose";
export const UserCriteriaSchema = {
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    
    spaceRating: {
        type: Number,
        default: 9
    },

    locationRating: {
        type: Number,
        default: 9
    },

    qualityRating: {
        type: Number,
        default: 9
    },

    serviceRating: {
        type: Number,
        default: 9
    },

    priceRating: {
        type: Number,
        default: 9
    },
}