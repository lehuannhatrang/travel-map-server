import express from 'express';
import { PlaceInfoModel, PlaceRatingModel } from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";
import { exec } from "child_process";
import { IndexConfig } from "../../../configs"

const PlaceRouter = express.Router();

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

    const criteriaScriptPath = `${IndexConfig.RECOMMENDER_SYSTEM_BASE_DIR}/${IndexConfig.CRITERIA_BASED_SCRIPT}`

    const command = `python3.5 ${criteriaScriptPath} ${spacePoint} ${locationPoint} ${qualityPoint} ${servicePoint} ${pricePoint}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            HttpUtil.makeErrorResponse(res, 500)
            return;
        }
        const restaurantList = stdout.replace('\n', '').split(',')
        PlaceInfoModel.getByQuery({placeId: {$in: restaurantList }})
        .then(result => {
            console.log(result)
            PlaceRatingModel.getByQuery({placeId: {$in: restaurantList }})
            .then(ratingPoints => {
                HttpUtil.makeJsonResponse(res, {places: result, ratingPoints })
            })
            .catch(err => console.log(err))
        })
        .catch(err => HttpUtil.makeErrorResponse(res, 500))
    });
})


export default PlaceRouter;