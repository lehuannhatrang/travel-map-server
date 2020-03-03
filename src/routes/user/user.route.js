import express from 'express';
import { UserModel, UserInfoModel } from '../../models';
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

export default UserRouter;