import express from 'express';
import {UserActionModel, UserModel, PlaceInfoModel, UserCriteriaModel} from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import { IndexConfig, CommonConfig } from "../../../configs";

const router = express.Router();


const recommenderServiceApiHeaders = {
    "Authorization": CommonConfig.RECOMMENDER_SERVICE_API_KEY
}

router.post('/suggestion-trips', async (req, res) => {
    console.log('lll')
    const planning = req.body.planning

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

    console.log(suggestionTrips.routes[0].route)

    HttpUtil.makeJsonResponse(res, suggestionTrips)
})

export default router;
