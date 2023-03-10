const mongoose = require('mongoose');
const Helper = require('../helper/Helper');
const Follow = new mongoose.Schema({
    userId          : { type : mongoose.Schema.Types.ObjectId , index : true},
    interest        : { type : Boolean , default : true},
    schduleCall     : { type : Date , default : null},
    message         : { type : String , default : null},
    status          : { type : Boolean , default : true},
    createdAt       : { type : Date , index : true},
    updatedAt       : { type : Date , index:true}
});
module.exports = mongoose.model('follows',Follow);