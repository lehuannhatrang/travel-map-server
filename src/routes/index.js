import express from 'express';
import jwt from 'express-jwt';
import AuthenRoute from './authen.route';
import AppRoute from './app.route';
import {CommonConfig} from "../../configs";
import {Error} from "../errors/Error";
import HttpUtil from "../utils/http.util";

const IndexRoute = express.Router({strict: true});

IndexRoute.use(jwt({
    secret: CommonConfig.SECRET,
    getToken: (req) => (req.headers['authorization']),
}).unless({ path: [/^\/api\/auth.*/, /^\/api\/external.*/]}));

// Check Token Expired
IndexRoute.use((err, req, res, next) => {
    console.log(req.headers)
    if (err.name === 'UnauthorizedError') {
        let errorCode = Error.UN_AUTHORIZATION;
        if (err.inner && err.inner.name === 'TokenExpiredError') {
            errorCode = Error.SESSION_EXPIRED
        }
        HttpUtil.makeErrorResponse(res, errorCode);
    } else {
        next();
    }
});
// api authen
IndexRoute.use('/auth', AuthenRoute);

//Route App

IndexRoute.use('/', AppRoute);

export default IndexRoute;