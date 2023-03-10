const Helper = require('../helper/Helper');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const User = require('../models/User');
const Authenticate = async (req,res,next) => {
    try{
        let token;
        if (req?.headers?.authorization && req?.headers?.authorization?.startsWith("Bearer")) {
            token = req?.headers?.authorization?.split(" ")[1];
        } else if (req?.cookies?.jwt) {
            token = req?.cookies?.jwt;
            const cookieToken = req?.cookies?.jwt;
        }
        if (!token) {
            Helper.response(false,'No Token Found!!',{},res,200);
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const id = decoded?.data;
        if (!id) Helper.response(false,'JWT Malformed!!',{},res,200);
        if(id != process.env.APP_LOGIN_USERNAME) Helper.response(false,'No User Found!!',{},res,200);
        req.user = id;
        next();
    } catch (error) {
        Helper.response(false,'Token Expired!!',{},res,200);
    }
};
module.exports = Authenticate; 