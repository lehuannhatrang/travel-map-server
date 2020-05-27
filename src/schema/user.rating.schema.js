export const UserRatingSchema = {
    "User_Id" : String,
    "Place_Id" : Number,
    "Comment" : String,
    "Rating" : Number,
    "TotalLike" : Number,
    "RestaurantUrl" : String,
    "Rating_Space" : Number,
    "Rating_Location" : Number,
    "Rating_Quality" : Number,
    "Rating_Service" : Number,
    "Rating_Price" : Number,
    "TimeStamp" : Date,
    type: {
        type: "String",
        enum: ["RESTAURANT", "VISITING"]
    }
}