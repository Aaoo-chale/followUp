const FollowUpController = {};
const Helper = require('../helper/Helper');
const User = require('../models/User');
const Follow = require('../models/Follow');
const ObjectId = require('mongodb').ObjectId;

FollowUpController.add = async(req,res,next) => {
    try {
        const { userId,type,nextfollowup,remark } = req.body;
        const follow = Follow({
            userId          : userId,
            type            : type,
            nextfollowup    : (nextfollowup == '' || nextfollowup== null ) ? null : Helper.DateFormat(nextfollowup),
            remark          : remark,
        });
        await follow.save();
        Helper.response(true,'Followup has been added Successfully!!',follow,res,200);
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}

FollowUpController.upcoming = async (req,res,next) => {
    try{
        const {type} = req.body;
        var getCurrentDate = new Date(Helper.currentTimeStamp());
        getCurrentDate.setDate(getCurrentDate.getDate-1);
        const upcoming = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$match:{nextfollowup:{$gte:getCurrentDate}}},
            {$sort:{createdAt:-1}}
        ]);
        var singleUserId = [];
        var upcomingData = [];
        upcoming.map((u)=>{
            if(!singleUserId.includes(u.userId.toString())){
                if(u.type==type){
                    d = {
                        ...u,
                        user:{
                            name:u.user[0].name,
                            email:u.user[0].email,
                            mobile:u.user[0].mobile
                        }
                    }
                    upcomingData.push(d);
                }
                singleUserId.push(u.userId.toString());
            }
        });
        if(upcomingData.length > 0){
            Helper.response(true,'Followup Upcoming Data get Successfully!!',upcomingData.reverse(),res,200);
        }else{
            Helper.response(false,'No Upcoming Data Found!!',{},res,200);
        }
    } catch (error){
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}


FollowUpController.visitDone = async (req,res,next) => {
    try {
        const visitDone = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$match:{type:'Visit Done'}},
            {$sort:{createdAt:-1}}
        ]);
        var singleUserId = [];
        var visitDoneData = [];
        visitDone.map((u)=>{
            if(!singleUserId.includes(u.userId.toString())){
                d = {
                    ...u,
                    user:{
                        name:u.user[0].name,
                        email:u.user[0].email,
                        mobile:u.user[0].mobile
                    }
                }
                visitDoneData.push(d);
                singleUserId.push(u.userId.toString());
            }
        });
        if(visitDoneData.length > 0){
            Helper.response(true,'Visit Done Data get Successfully!!',visitDoneData,res,200);
        }else{
            Helper.response(false,'No Upcoming Data Found!!',{},res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}

FollowUpController.missedFollowups = async (req,res,next) =>{
    try {
        var getCurrentDate = new Date(Helper.currentTimeStamp());
        const missed = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$sort:{createdAt:-1}}
        ]);
        var singleUserId = [];
        var missedData = [];
        missed.map((u)=>{
            if(!singleUserId.includes(u.userId.toString())){
                if(u.nextfollowup < getCurrentDate){
                    d = {
                        ...u,
                        user:{
                            name:u.user[0].name,
                            email:u.user[0].email,
                            mobile:u.user[0].mobile
                        }
                    }
                    missedData.push(d);
                }
                singleUserId.push(u.userId.toString());
            }
        });
        if(missedData.length > 0){
            Helper.response(true,'Missing Followup data get Successfully!!',missedData,res,200);
        }else{
            Helper.response(false,'No Missing Followup Data Found!!',{},res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}


FollowUpController.allFollowups = async (req,res,next) => {
    try {
        const allFollowups = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$sort:{createdAt:-1}}
        ]);
        var allFollowupsData = [];
        allFollowups.map((u)=>{
            d = {
                ...u,
                user:{
                    name:u.user[0].name,
                    email:u.user[0].email,
                    mobile:u.user[0].mobile
                }
            }
            allFollowupsData.push(d);
        });
        if(allFollowupsData.length > 0){
            Helper.response(true,'Followup data get Successfully!!',allFollowupsData,res,200);
        }else{
            Helper.response(false,'No Followup Data Found!!',{},res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}

FollowUpController.userReport = async (req,res,next) => {
    try {
        const userId =  new ObjectId(req.body.userId);
        const allFollowups = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$match:{userId:userId}},
            {$sort:{createdAt:-1}}
        ]);
        var allFollowupsData = [];
        allFollowups.map((u)=>{
            d = {
                ...u,
                user:{
                    name:u.user[0].name,
                    email:u.user[0].email,
                    mobile:u.user[0].mobile
                }
            }
            allFollowupsData.push(d);
        });
        if(allFollowupsData.length > 0){
            Helper.response(true,'Followup data get Successfully!!',allFollowupsData,res,200);
        }else{
            Helper.response(false,'No Followup Data Found!!',{},res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}


FollowUpController.notInterestedUsers = async (req,res,next) => {
    try{
        const notInterested = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$sort:{createdAt:-1}}
        ]);
        var singleUserId = [];
        var notInterestedData = [];
        notInterested.map((u)=>{
            if(u.type == 'Not Interested'){
                d = {
                    ...u,
                    user:{
                        name:u.user[0].name,
                        email:u.user[0].email,
                        mobile:u.user[0].mobile
                    }
                }
                notInterestedData.push(d);
            }
            singleUserId.push(u.userId.toString());
        });
        if(notInterestedData.length > 0){
            Helper.response(true,'Not Interested Users data get Successfully!!',notInterestedData,res,200);
        }else{
            Helper.response(false,'No Not Interested Users Found!!',{},res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}


FollowUpController.othersReport = async (req,res,next) => {
    try{
        const others = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$match:{type:"Others"}},
            {$sort:{createdAt:-1}}
        ]);
        var singleUserId = [];
        var othersData = [];
        others.map((u)=>{
            //if(!singleUserId.includes(u.userId.toString())){
                d = {
                    ...u,
                    user:{
                        name:u.user[0].name,
                        email:u.user[0].email,
                        mobile:u.user[0].mobile
                    }
                }
                othersData.push(d);
                singleUserId.push(u.userId.toString());
            //}
        });
        if(othersData.length > 0){
            Helper.response(true,'Others Followup data get Successfully!!',othersData,res,200);
        }else{
            Helper.response(false,'No Others Followup Data Found!!',{},res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}


FollowUpController.visitReport = async (req,res,next) => {
    try{
        const others = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$match:{type:{$in:["Next Visit","Visit Done"]}}},
            {$sort:{createdAt:-1}}
        ]);
        var singleUserId = [];
        var othersData = [];
        others.map((u)=>{
            //if(!singleUserId.includes(u.userId.toString())){
                d = {
                    ...u,
                    user:{
                        name:u.user[0].name,
                        email:u.user[0].email,
                        mobile:u.user[0].mobile
                    }
                }
                othersData.push(d);
                singleUserId.push(u.userId.toString());
            //}
        });
        if(othersData.length > 0){
            Helper.response(true,'Others Followup data get Successfully!!',othersData,res,200);
        }else{
            Helper.response(false,'No Others Followup Data Found!!',{},res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}

FollowUpController.reVisitReport = async (req,res,next) => {
    try{
        const reVisit = await User.aggregate([
            {$lookup:
                {
                    from:"follows",
                    localField:"_id",
                    foreignField:"userId",
                    as:"follow"
                } 
            }
        ]);
        var userId = [];
        reVisit.map((r)=>{
            count = 0;
            r.follow.map((f)=>{
                if(f.type == 'Next Visit' || f.type == 'Next Followup'){
                    count++;
                }
            });
            if(count >= 2){
                userId.push(new ObjectId(r._id));
            }
        });
        const others = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$match:{type:{$in:["Next Visit","Next Followup"]},userId:{$in:userId}}},
            {$sort:{createdAt:-1}}
        ]);
        var singleUserId = [];
        var othersData = [];
        others.map((u)=>{
            if(!singleUserId.includes(u.userId.toString())){
                d = {
                    ...u,
                    user:{
                        name:u.user[0].name,
                        email:u.user[0].email,
                        mobile:u.user[0].mobile
                    }
                }
                othersData.push(d);
                singleUserId.push(u.userId.toString());
            }
        });
        if(othersData.length > 0){
            Helper.response(true,'Others Followup data get Successfully!!',othersData,res,200);
        }else{
            Helper.response(false,'No Others Followup Data Found!!',{},res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}

module.exports = FollowUpController;