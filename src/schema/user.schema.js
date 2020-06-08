export const UserSchema = {
    userId: {
        type: String,
        unique: true,
        require: true,
    },
    
    email: {
        type: String,
        unique: true,
        require: true,
    },

    password: {
        type: String,
    },
    
    status: {
        type: String,
        enum: ['ACTIVATED', 'DISABLED'],
    },

    displayName: String,
    
    phone: String,

    avatar: String,

    canRecommendByMf: {
        type: Boolean,
        default: false
    }
}