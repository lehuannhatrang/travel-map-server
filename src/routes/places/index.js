import express from 'express';
import { PlaceInfoModel, PlaceRatingModel, UserRatingModel, UserModel, UserCriteriaModel } from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import { exec } from "child_process";
import { IndexConfig, CommonConfig } from "../../../configs"

const PlaceRouter = express.Router();

const recommenderServiceApiHeaders = {
    "Authorization": CommonConfig.RECOMMENDER_SERVICE_API_KEY
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
  

PlaceRouter.get('/detail', (req, res) => {
    const placeId = req.query.id;

    PlaceInfoModel.getOneByQuery({placeId})
    .then(place => {
        if(!place) return HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
        PlaceRatingModel.getOneByQuery({placeId})
        .then(ratingPoint => {
            HttpUtil.makeJsonResponse(res, {place: {...place, ... ratingPoint}})
        })
    })
    .catch(err => HttpUtil.makeErrorResponse(res, Error.UNKNOWN))
})

PlaceRouter.get('/criterial-base/list', (req, res) => {
    const { spacePoint, locationPoint, qualityPoint, servicePoint, pricePoint} = req.query

    const criteria = [spacePoint, locationPoint, qualityPoint, servicePoint, pricePoint]

    const criteriaScriptPath = `${IndexConfig.RECOMMENDER_SYSTEM_BASE_DIR}/${IndexConfig.CRITERIA_BASED_SCRIPT}`

    const command = `python3.5 ${criteriaScriptPath} ${spacePoint} ${locationPoint} ${qualityPoint} ${servicePoint} ${pricePoint}`;

    HttpUtil.postJson(`${IndexConfig.RECOMMENDER_SERVICE_URL}/recommender-places/criteria`, {criteria}, recommenderServiceApiHeaders)
    .then(placeList => {
        const recommenderList = placeList.recommenderPlaces;
        PlaceInfoModel.getByQuery({placeId: {$in: recommenderList }})
        .then(result => {
            PlaceRatingModel.getByQuery({placeId: {$in: recommenderList }})
            .then(ratingPoints => {
                HttpUtil.makeJsonResponse(res, {places: result, ratingPoints })
            })
            .catch(err => console.log(err))
        })
        .catch(err => HttpUtil.makeErrorResponse(res, 500))
    })
})


PlaceRouter.get('/recommender-places', async (req, res) => {
    // const { spacePoint, locationPoint, qualityPoint, servicePoint, pricePoint} = req.query

    let criteria = []

    const user = await UserModel.getOneByQuery({_id: req.user.sub});

    const userCriteria = await UserCriteriaModel.getOneByQuery({user})

    if(!userCriteria) {
        criteria = [9,9,9,9,9]
    }
    else {
        criteria = [userCriteria.spaceRating, userCriteria.locationRating, userCriteria.qualityRating, userCriteria.serviceRating, userCriteria.priceRating]
    }

    let useMF = false;
    
    if(!user.canRecommendByMf) {
        const userRatings = await UserRatingModel.getByQuery({"User_Id": user.userId})
        if(userRatings.length > 3) {
            useMF = true
            UserModel.updateModel({...user, canRecommendByMf: true}, req.user.sub)
        }
    }

    let recommenderList = []
    if(user.canRecommendByMf || useMF) {
        const placeList = await HttpUtil.postJson(`${IndexConfig.RECOMMENDER_SERVICE_URL}/recommender-places/MF-recommender`, {criteria ,userId: user.userId, placeType: 'RESTAURANT'}, recommenderServiceApiHeaders)
        recommenderList = placeList.recommenderPlaces;
    }
    else {
    
        const placeList = await HttpUtil.postJson(`${IndexConfig.RECOMMENDER_SERVICE_URL}/recommender-places/criteria`, {criteria}, recommenderServiceApiHeaders)
        
        recommenderList = placeList.recommenderPlaces;
    }

    const result = await PlaceInfoModel.getByQuery({placeId: {$in: recommenderList }})

    const ratingPoints = await PlaceRatingModel.getByQuery({placeId: {$in: recommenderList }})

    HttpUtil.makeJsonResponse(res, {places: shuffle(result), ratingPoints })
})

PlaceRouter.get('/rating', async (req, res) => {
    const placeId = req.query.placeId;
    const userRatings = await UserRatingModel.getByQuery({"Place_Id": placeId})
    const result = []
    userRatings.map(rating => {
        const userId = rating["User_Id"]
        UserModel.getOneByQuery({userId})
        .then(author => {
            if(!author) 
                result.push({
                    ...rating,
                    author: {
                        displayName: 'Amonyous User'
                    },
                })
            else 
                result.push({
                    ...rating,
                    author,
                })
            if(userRatings.length === result.length) HttpUtil.makeJsonResponse(res, {userRatings: result})
        })
    });
})

PlaceRouter.post('/rating', async (req, res) => {
    const body = req.body;
    const placeId = body.placeId;
    const rating = body.rating;
    const comment = body.comment;
    console.log(placeId, rating, comment)
    const currentUser = await UserModel.getOneByQuery({_id: req.user.sub})

    const placeInfo = await PlaceInfoModel.getOneByQuery({placeId})

    const averageRating = (rating.spaceRating + rating.locationRating + rating.qualityRating + rating.serviceRating + rating.priceRating)*2
    const new_rating = {
        "User_Id" : currentUser.userId,
        "Place_Id" : placeId,
        "Comment" : comment,
        "Rating" : averageRating,
        "TotalLike" : 0,
        "RestaurantUrl" : '',
        "Rating_Space" : rating.spaceRating*10,
        "Rating_Location" : rating.locationRating*10,
        "Rating_Quality" : rating.qualityRating*10,
        "Rating_Service" : rating.serviceRating*10,
        "Rating_Price" : rating.priceRating*10,
        "TimeStamp" : new Date(),
        type: placeInfo.type
    }

    UserRatingModel.createModel(new_rating)
    
    HttpUtil.makeJsonResponse(res, {message: "Rating sucessfully"})
})

PlaceRouter.get('/search', async (req, res) => {
    const keyword = req.query.keyword;
    const searchPlaces = await PlaceInfoModel.getByQuery({$or: [
        {name: { $regex: keyword, $options: 'i'}},
        {address: { $regex: keyword, $options: 'i'}}
    ]})
    const searchListId = await searchPlaces.map(place => place.placeId)
    const ratingPoints = await PlaceRatingModel.getByQuery({placeId: {$in: searchListId }})

    HttpUtil.makeJsonResponse(res, {places: searchPlaces, ratingPoints});

})


export default PlaceRouter;