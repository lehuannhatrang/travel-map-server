import express from 'express';
import {CommonConfig, IndexConfig} from '../../configs';
import {TokenUtil} from '../utils';
import Passport from 'passport';
import urljoin from 'url-join';
import HttpUtil from "../utils/http.util";
import {Error} from "../errors/Error";
import { UserModel } from "../models";
import passwordHash from "password-hash";

const AuthenRoute = express.Router();


// AuthenRoute.get('/token', AuthenMiddleware.isAuthenticated, (req, res) => {
//     if (req.session.token) return HttpUtil.makeJsonResponse(res, { token: req.session.token });
//     return HttpUtil.makeErrorResponse(res, "Not Authenticated 2 !!!", 500);
// });

// AuthenRoute.use('/login/sso', (req, res, next) => {
//     Passport.authenticate('cas', {session: false}, function (err, user, info) {
//         if (err) {
//             return next(err);
//         }

//         if (!user) {
//             return res.redirect(`${req.query.redirect}?user=noUser`)
//         }

//         req.login(user, {session: false}, function (err) {
//             if (err) {
//                 return next(err);
//             }
//             //create token add session
//             TokenUtil.createToken(user, CommonConfig.SECRET)
//                 .then((token) => {
//                     if (req.query.checkUser) {
//                         res.redirect(`${req.query.redirect}?user=${user.user}`)
//                     } else {
//                         res.redirect(`${req.query.redirect}?authorization=${token}`)
//                     }

//                 }, (err) => {
//                     return next(err);
//                 });
//         });
//     })(req, res, next);
// });

AuthenRoute.use('/signup', (req, res) => {
    const { email, name, phone, password } = req.body;
    if(!email || !name || !phone || !password)  HttpUtil.makeErrorResponse(res, Error.BAD_REQUEST);
    
    UserModel.getOneByQuery({email})
    .then(async result => {
        if(result)  HttpUtil.makeErrorResponse(res, Error.DUPLICATE_USERNAME);
        else {
            const hashPassword = passwordHash.generate(password)
            const userId = `guidy-${Math.floor(Math.random() * Math.floor(100000))}`
            const newUser = {
                userId,
                email,
                password: hashPassword,
                status: 'ACTIVATED',
                displayName: name,
                phone,
            }
            console.log(newUser)
            UserModel.createModel(newUser)
            .then(newModel => {
                HttpUtil.makeJsonResponse(res, {userId: newModel.userId})
            })
            .catch(err =>{console.log(err); HttpUtil.makeErrorResponse(res, Error.UNKNOWN)})
        };
    });
})

AuthenRoute.use('/login', (req, res, next) => {
    Passport.authenticate('local', {session: false}, function (err, user, info) {
        console.log(user)
        if (err) {
            return next(err);
        }
        if (!user) {
            return HttpUtil.makeErrorResponse(res, Error.WRONG_USERNAME_PASSWORD)
        }

        req.login(user, {session: false}, function (err) {
            if (err) {
                return next(err);
            }
            //create token add session
            TokenUtil.createToken(user, CommonConfig.SECRET)
                .then((token) => {
                    delete user.password;
                    HttpUtil.makeJsonResponse(res, {token, user})
            }, (err) => {
                return next(err);
            });
        });
        console.log('next', next)
    })(req, res, next);
});

AuthenRoute.use('/verify', (req, res, next) => {
   TokenUtil.decodeToken(req.headers['authorization'], CommonConfig.SECRET)
       .then(x => res.send(x), error => next(error));
});

AuthenRoute.get('/logout', function (req, res) {
    //req.session.destroy(function (err) {
        res.redirect(urljoin(IndexConfig.CAS_URL, `/logout?service=${IndexConfig.URL_FRONTEND}/login`));
    //});
});

export default AuthenRoute;