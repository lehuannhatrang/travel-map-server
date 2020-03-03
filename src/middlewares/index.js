import {IndexConfig} from '../../configs';
import {ObUtil} from '../utils';
import {UserModel, UserInfoModel} from '../models';
import passwordHash from "password-hash";

// const CasStrategy = require('passport-cas').Strategy;
const LocalStrategy = require('passport-local').Strategy;
class AuthenMiddleware {
    // strategy

    static strategyLocal() {
        return new LocalStrategy((username, password, done) => {
            console.log(username)
            UserModel.getOneByQuery({email: username})
                .then(user => {
                    console.log(user)
                    if (!user) {
                        return done(null, false, {message: 'Incorrect username or password'});
                    }

                    const result = passwordHash.verify(password, user.password);    
                    console.log("result: ", result);
                    if (!result) {
                        return done(err, false, {message: 'Incorrect username or password'});
                    }
                    console.log("OK");
                    return done(null, user);
                });
        })
    }

    

    // serial User
    static serializeUser(user, done) {
        // lay ghi du lieu ra ngoai
        done(null, user);
    }

    // deserialLize
    static deserializeUser(user, done) {
        // get user by Id
        let userId = ObUtil.toObjectIdMongo(user._id);
        // get user by id
        UserModel.getById(userId).then((user) => {
            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }
            // set atrribute
            return done(null, user);
        }, (err) => {
            return done(err);
        });
    }

    static isAuthenticated(req, res, next) {
        //console.log(req.headers);
        return next();
        // if (req.isAuthenticated()) {
        //     return next();
        // } else {
        //     res.redirect(urljoin(IndexConfig.BASE_NAME, 'auth'));
        // }
    }
}

export default AuthenMiddleware;