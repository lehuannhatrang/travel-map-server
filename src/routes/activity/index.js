import express from 'express';
import {UserActionModel} from '../../models';
import HttpUtil from "../../utils/http.util";
import {Error} from "../../errors/Error";

const UserActionRouter = express.Router();

UserActionRouter.get('/list', (req, res) => {
    UserActionModel.list(['user'])
        .then(actions => {
            HttpUtil.makeJsonResponse(res, actions)
        })
        .catch(err => {
            console.log(err)
            HttpUtil.makeErrorResponse(res, Error.ITEM_NOT_FOUND)
        })
})

export default UserActionRouter;
