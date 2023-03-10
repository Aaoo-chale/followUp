const mongoose = require('mongoose');
const Helper = require('../helper/Helper');
const Follow = new mongoose.Schema({
    userId          : { type : mongoose.Schema.Types.ObjectId , index : true},
    type            : { type : String , index:true},
    nextfollowup    : { type : Date , default : null},
    remark          : { type : String , default : null},
    status          : { type : Boolean , default : true},
    createdAt       : { type : Date , default : Helper.currentTimeStamp()},
    updatedAt       : { type : Date , index:true}
});
module.exports = mongoose.model('follows',Follow);