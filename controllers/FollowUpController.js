const FollowUpController = {};
const Helper = require('../helper/Helper');
const User = require('../models/User');
const Follow = require('../models/Follow');

FollowUpController.add = async(req,res,next) => {
    try {
        const { userId,type,nextfollowup,remark } = req.body;
        const follow = Follow({
            userId          : userId,
            type            : type,
            nextfollowup    : Helper.DateFormat(nextfollowup),
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
        const upcoming = await Follow.aggregate([
            {$lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {$match:{type:type}}
        ]);
        Helper.response(true,'Followup Upcoming data Successfully!!',follow,res,200);
    } catch (error){
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}



module.exports = FollowUpController;