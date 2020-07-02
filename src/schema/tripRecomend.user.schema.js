import {Schema} from "mongoose";
export const TripRecommendUserSchema = {
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    date: Date,

    recommendRoutes: [
        {
            index: Number,
            distance: Number,
            fitness_value: Number,
            user_perference: Number,
            route: [
                {
                    placeId: Number,
                    planning: {
                        type: Schema.Types.Mixed
                    },
                    place: {
                        type: Schema.Types.Mixed
                    }
                }
            ],
        }
    ],

    userPreferenceRouteIndex: [Number],

    createdAt: Date

} 