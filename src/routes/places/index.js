import express from 'express';
import { RestaurantInfoModel } from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import { exec } from "child_process";
import { IndexConfig } from "../../../configs"

const PlaceRouter = express.Router();

PlaceRouter.get('/detail', (req, res) => {
    const placeId = req.query.id;

    RestaurantInfoModel.getOneByQuery({restaurantId: placeId})
    .then(place => {
        if(!place) return HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);

        HttpUtil.makeJsonResponse(res, {place})
    })
    .catch(err => HttpUtil.makeErrorResponse(res, Error.UNKNOWN))
})

PlaceRouter.get('/criterial-base/list', (req, res) => {
    const { spacePoint, locationPoint, qualityPoint, servicePoint, pricePoint} = req.query

    const criteriaScriptPath = `${IndexConfig.RECOMMENDER_SYSTEM_BASE_DIR}/${IndexConfig.CRITERIA_BASED_SCRIPT}`

    const command = `python3 ${criteriaScriptPath} ${spacePoint} ${locationPoint} ${qualityPoint} ${servicePoint} ${pricePoint}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            HttpUtil.makeErrorResponse(res, 500)
            return;
        }
        const result = stdout.split(',')
        console.log(`${result}`);
        RestaurantInfoModel.getByQuery({restaurantId: {$in:[ 4827,3807,10885,11986,10615,5670,10699,5190,12567,7669] }})
        .then(result => {
            console.log(result)
        })
    });
})


export default PlaceRouter;