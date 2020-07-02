import express from 'express';
import {UserActionModel, UserModel, PlaceInfoModel, UserCriteriaModel, TripRecommendUserModel} from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import { IndexConfig, CommonConfig } from "../../../configs";

const router = express.Router();


const recommenderServiceApiHeaders = {
    "Authorization": CommonConfig.RECOMMENDER_SERVICE_API_KEY
}

router.get('/', async (req, res) => {
    const id = req.query.id;
    const user = await UserModel.getOneByQuery({_id: req.user.sub})
    const trips = await TripRecommendUserModel.getOneByQuery({user, _id: id})
    HttpUtil.makeJsonResponse(res, trips)
})

router.post('/suggestion-trips', async (req, res) => {
    const planning = req.body.planning;

    const travelDate = req.body.travelDate;

    const currentUser = await UserModel.getOneByQuery({_id: req.user.sub})

    let suggestionTrips = []

    let criteria = [];

    const user = await UserModel.getOneByQuery({_id: req.user.sub})

    const userCriteria = await UserCriteriaModel.getOneByQuery({user})

    if(!userCriteria) {
        criteria = [9,9,9,9,9]
    }
    else {
        criteria = [userCriteria.spaceRating, userCriteria.locationRating, userCriteria.qualityRating, userCriteria.serviceRating, userCriteria.priceRating]
    }

    if(currentUser.canRecommendByMf) {
        suggestionTrips = await HttpUtil.postJson(`${IndexConfig.RECOMMENDER_SERVICE_URL}/planning-trips`, {userId: currentUser.userId, criteria, planning, userMF: true}, recommenderServiceApiHeaders);
    }
    else {
        suggestionTrips = await HttpUtil.postJson(`${IndexConfig.RECOMMENDER_SERVICE_URL}/planning-trips`, {userId: currentUser.userId, criteria, planning, userMF: false}, recommenderServiceApiHeaders);
    }

    const recommendTrip = {
        user: currentUser,
        date: new Date(travelDate),
        recommendRoutes: suggestionTrips.routes.map((route, index) => ({
            ...route,
            index
        })),
        createdAt: new Date(),
    }

    const newTrips = await TripRecommendUserModel.createModel(recommendTrip)

    HttpUtil.makeJsonResponse(res, {routes: suggestionTrips.routes, id: newTrips._id})
})

router.post('/prefer', async (req, res) => {
    const id = req.body.id;
    const index = req.body.index;
    let trips = await TripRecommendUserModel.getOneByQuery({_id: id})
    if(!trips) {
        return HttpUtil.makeJsonResponse(res, 500)
    }

    const newPrefer = trips.userPreferenceRouteIndex.concat([index])
    trips.userPreferenceRouteIndex = [...new Set(newPrefer)]
    const updateModel = await TripRecommendUserModel.updateModel(trips)
    HttpUtil.makeJsonResponse(res, {status: 'success', preferIndex: updateModel.userPreferenceRouteIndex})
})

router.post('/unlike', async (req, res) => {
    const id = req.body.id;
    const index = req.body.index;
    let trips = await TripRecommendUserModel.getOneByQuery({_id: id})
    if(!trips) {
        return HttpUtil.makeJsonResponse(res, 500)
    }

    const newPrefer = trips.userPreferenceRouteIndex.filter(ind => ind !== index)
    trips.userPreferenceRouteIndex = [...new Set(newPrefer)]
    const updateModel = await TripRecommendUserModel.updateModel(trips)
    HttpUtil.makeJsonResponse(res, {status: 'success', preferIndex: updateModel.userPreferenceRouteIndex})
})

export default router;
