import express from 'express';
import { UserModel, UserInfoModel, UserCriteriaModel, TripRecommendUserModel } from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";

const UserRouter = express.Router();

UserRouter.get('/list', (req, res) => {
    UserModel.list(['userInfo'], '-password')
        .then(users => {
            HttpUtil.makeJsonResponse(res, users)
        })
        .catch(err => {
            console.log(err)
            HttpUtil.makeErrorResponse(res, Error.UN_AUTHORIZATION)
        })
})

UserRouter.get('/', (req, res) => {
    const userId = req.user.sub;
    UserModel.getById(userId, 'userInfo')
        .then(user => {
            if (user) {
                delete user.password;
                HttpUtil.makeJsonResponse(res, user);
            } else {
                HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
            }
        })
        .catch(err => {
            console.log(err)
            HttpUtil.makeErrorResponse(res, Error.UN_AUTHORIZATION);
        })
})

UserRouter.get('/my-trips', async (req, res) => {
    const user = await UserModel.getOneByQuery({_id: req.user.sub})
    const userTrips = await TripRecommendUserModel.getByQuery({user})
    HttpUtil.makeJsonResponse(res, userTrips)
})

UserRouter.delete('/trip', async (req, res) => {
    const id = req.query.id;
    const user = await UserModel.getOneByQuery({_id: req.user.sub})
    const userTrip = await TripRecommendUserModel.getOneByQuery({user, _id: id})
    const deletedModel = await TripRecommendUserModel.deleteModel(userTrip) 
    HttpUtil.makeJsonResponse(res, {message: 'successfully'})
})

UserRouter.post('/', (req, res) => {
    let createUser = req.body;
    createUser.localAccount = true;
    createUser.status = 'ACTIVATED';
    UserModel.createModel(createUser, req.user.sub)
        .then(user => HttpUtil.makeJsonResponse(res, user));
})

UserRouter.put('/', (req, res) => {
    UserModel.updateModel(req.body.id, req.body, req.user.sub)
        .then(user => HttpUtil.makeJsonResponse(res, user));
})

UserRouter.put('/info', (req, res) => {
    if (req.body.user !== req.user.sub)
        return HttpUtil.makeErrorResponse(res, Error.WRONG_USER)
    UserInfoModel.updateModel(req.body.id, req.body, req.user.sub)
        .then(userInfo => HttpUtil.makeJsonResponse(res, userInfo));
})

UserRouter.post('/avatar', (req, res) => {
    const userId = req.user.sub;
    const avatar = req.body.img;
    UserModel.getById(userId)
    .then(user => {
        if (!user) return HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND);
        let newModel = user;
        newModel.avatar = avatar;
        UserModel.updateModel(newModel, req.user.sub)
        .then(updatedUser => {
            HttpUtil.makeJsonResponse(res, updatedUser)
        })
    })
    .catch(err => {
        HttpUtil.makeErrorResponse(res, Error.UN_AUTHORIZATION);
    })
})

UserRouter.get('/criteria', async (req, res) => {
    const user = await UserModel.getOneByQuery({_id: req.user.sub})
    const userCriteria = await UserCriteriaModel.getOneByQuery({user})
    if(!userCriteria) {
        const newUserCriteria = {
            user,
            spaceRating: 9,
            locationRating: 9,
            qualityRating: 9,
            serviceRating: 9,
            priceRating: 9
        }
        UserCriteriaModel.createModel(newUserCriteria)
        .then(newModel => {
            HttpUtil.makeJsonResponse(res, {criteria: newModel})
        })
        .catch(err => HttpUtil.makeErrorResponse(res, 500))
    }
    else {
        HttpUtil.makeJsonResponse(res, {criteria: userCriteria})
    }
})

UserRouter.post('/criteria', async (req, res) => {
    const rating = req.body.rating;
    const user = await UserModel.getOneByQuery({_id: req.user.sub})
    const userCriteria = await UserCriteriaModel.getOneByQuery({user})
    if(!userCriteria) {
        const newUserCriteria = {
            user,
            spaceRating: rating.spaceRating*10,
            locationRating: rating.locationRating*10,
            qualityRating: rating.qualityRating*10,
            serviceRating: rating.serviceRating*10,
            priceRating: rating.priceRating*10
        }
        await UserCriteriaModel.createModel(newUserCriteria)
        HttpUtil.makeJsonResponse(res, {message: 'Create new criteria'})
    }
    else {
        let updateCriteria = {
            ...userCriteria,
            spaceRating: rating.spaceRating*10,
            locationRating: rating.locationRating*10,
            qualityRating: rating.qualityRating*10,
            serviceRating: rating.serviceRating*10,
            priceRating: rating.priceRating*10
        }
        await UserCriteriaModel.updateModel(updateCriteria)
        HttpUtil.makeHttpResponse(res, {message: 'Update criteria successfully'})
    }
})

export default UserRouter;