const mongoose = require('mongoose');
const Helper = require('../helper/Helper');
const User = new mongoose.Schema({
    name            : { type : String , index : true},
    status          : { type : Boolean , default : true},
    email           : { type : String , index : true},
    mobile          : { type : String , index : true},
    alternateMobile : { type : String , index : true},
    addedBy         : { type : String , default: 'Self'},
    createdAt       : { type : Date , default : Helper.currentTimeStamp()},
    updatedAt       : { type : Date , index:true},
    deletedAt       : { type : Date , index:true}
});
module.exports = mongoose.model('users',User);