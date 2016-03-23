/**
 * Created by tav0 on 22/03/16.
 */
'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    io = require('socket.io'),
    app = express(),
    server = app.listen('8070'),
    io = io.listen(server);

require('./socket')(io);

app.use(bodyParser.urlencoded({extended: false}));

    app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

