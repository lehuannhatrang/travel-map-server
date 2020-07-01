import Schema from "mongoose";
export const TripRecommendUserSchema = {
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    date: Date,

    recommendRoutes: [
        {
            distance: Number,
            fitness_value: Number,
            user_perference: Number,
            route: [String],
        }
    ],

    userPreferenceRouteIndex: [
        {
            placeId: Number,
            planning: {
                type: Schema.Types.Mixed
            }
        }
    ],

    ds: Date

} 