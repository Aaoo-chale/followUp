const Helper = {};
const jwt = require('jsonwebtoken');
const fs = require('fs');
Helper.response = (status,message,data,res,statuscode=200) =>res.status(statuscode).json({status:status,message:message,data:data});
Helper.ISTTime = (d) => d.getTime() + 5.5 * 60 * 60 * 1000;
Helper.DateFormat = (d) => Helper.ISTTime(new Date(d));
Helper.currentTimeStamp = () => Helper.ISTTime(new Date());  
Helper.createJWTSign = async (data) => {
    const token = await jwt.sign({data:data},process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRETIME });
    return token;
}

module.exports = Helper;    
//res.send(require('crypto').randomBytes(64).toString('hex'));