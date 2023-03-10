const express = require("express");
var ApiRouter = express.Router();
const UserRoute = require('./UserRoute');
ApiRouter.use('/',UserRoute);
module.exports = ApiRouter;