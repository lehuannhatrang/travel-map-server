import express from 'express';
import {UserActionModel, UserModel, PlaceInfoModel} from '../../models';
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

    if(currentUser.canRecommendByMf) {
        suggestionTrips = await HttpUtil.postJson(`${IndexConfig.RECOMMENDER_SERVICE_URL}/planning-trips`, {userId: currentUser.userId, planning}, recommenderServiceApiHeaders);
    }
    else {
        const criteria = [8,7,9,9,8]
        suggestionTrips = await HttpUtil.postJson(`${IndexConfig.RECOMMENDER_SERVICE_URL}/planning-trips`, {userId: currentUser.userId, criteria: criteria, planning}, recommenderServiceApiHeaders);
    }

    console.log(suggestionTrips)

    HttpUtil.makeJsonResponse(res, suggestionTrips)
})

export default router;
