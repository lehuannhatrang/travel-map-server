import {IndexConfig} from "./configs";
import AuthenMiddleware from "./src/middlewares/index";
import IndexRoute from "./src/routes/index";
import winston from "./configs/winston/winston.config";

const Passport = require("passport");

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

const mongoose = require('mongoose');
var cors = require('cors');
var app = express();

if (IndexConfig.PROFILE !== 'dev') {
    app.use(morgan('combined', { stream: winston.stream }));
} else {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', IndexConfig.ACCESS_CONTROL_ORIGIN);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(cors({ credentials: true, origin: true, optionsSuccessStatus: 200 }));
app.use('/api/', IndexRoute);
// app.use('/users', usersRouter);

//connect database
var url = IndexConfig.AUTH_DB.url;
const mongodbOptions = IndexConfig.AUTH_DB.options;
//connect database
mongoose.connect(url, mongodbOptions, (err, res) => {
    if (err)
        console.log('MongoDB ERROR: cannot connect to ' + IndexConfig.AUTH_DB + '. ' + err);
    else
        console.log('MongoDB: connect successfully');
});

// set authen
Passport.use(AuthenMiddleware.strategyLocal());
// Passport.use(AuthenMiddleware.strategyCAS());
Passport.serializeUser(AuthenMiddleware.serializeUser);
Passport.deserializeUser(AuthenMiddleware.deserializeUser);

module.exports = app;
