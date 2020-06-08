import express from 'express';
import UserRouter from "./user/user.route";
import UserActionRouter from "./activity";
import {UserModel} from '../models'
import HttpUtil from "../utils/http.util";
import {Error} from "../errors/Error";
import PlaceRoute from "./places";
import PlanningTrip from "./planning-trip";

const AppRoute = express.Router();

AppRoute.use((req, res, next) => {
    if (req.user && req.user.sub){
        UserModel.getById(req.user.sub)
            .then(user => {
                if(!user) return HttpUtil.makeErrorResponse(res, Error.UN_AUTHORIZATION)
                next();
            }).catch(err => {
                next(err)
            })
    } else {
        next()
    }
})

AppRoute.use('/isLogin', (req, res) => {
    HttpUtil.makeJsonResponse(res, {isLogin: true})
})

// gte route
AppRoute.use('/user', UserRouter);
AppRoute.use('/action', UserActionRouter);
AppRoute.use('/places', PlaceRoute);
AppRoute.use('/planning-trip', PlanningTrip)

export default AppRoute;