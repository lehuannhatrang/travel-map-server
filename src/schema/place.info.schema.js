export const PlaceInfoSchema = {
    placeId: Number,

    name: String,

    address: String,

    beginTime: String,

    endTime: String,

    minPrice: String,

    maxPrice: String,

    mainImgUri: String,

    pictures: [String],

    latitude: String,

    longitude: String,

    addressRegion: String,

    addressLocality: String,

    streetAddress: String,

    mainCategory: String,

    subCategory: String,

    type: {
        type: "String",
        enum: ["RESTAURANT", "VISITING"]
    }
    
}