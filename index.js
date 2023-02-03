"use strict";
exports.__esModule = true;
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var env_1 = require("@root/env");
var index_1 = require("@/router/index");
// timezone
process.env.TZ = 'Asia/Bangkok';
console.log(new Date().toString());
var PORT = (0, env_1["default"])().PORT;
// mongodb
mongoose_1["default"].set('strictQuery', false);
mongoose_1["default"].connect('mongodb://localhost:27017/test').then(function () { return console.log('mongodb: connected!'); });
// express
var app = (0, express_1["default"])();
// http/https
var httpServer = http_1["default"].createServer(app);
var io = new socket_io_1.Server(httpServer);
// router
(0, index_1["default"])(app, io);
// socket
io.on('connection', function (socket) {
    // list client ip in the whitelist to prevent access from the unknown
    var remoteAddress = socket.client.conn.remoteAddress;
    console.log('a user connected', remoteAddress);
    socket.on('disconnect', function () {
        console.log('user disconnected', remoteAddress);
    });
});
// run the heart beat to perform the process in every second
// runHeartBeat();
// server
httpServer.listen(PORT, function () {
    console.log("HTTP Server running on port ".concat(PORT));
});
