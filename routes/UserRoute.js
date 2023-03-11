const express = require("express");
const Authenticate = require('../middleware/Authenticate');
var UserRoute = express.Router();
const UserAuthController = require('../controllers/UserAuthController');
const FollowUpController = require('../controllers/FollowUpController');
const Helper = require('../helper/Helper');
const User = require('../models/User');
const { check,body,validationResult} = require('express-validator');
require('express-group-routes');    

UserRoute.get('/',(req,res,next)=>{
    res.send(`Welcome to ${process.env.APP_NAME} Application`);
});

UserRoute.post('/login',(req,res,next)=>{
    UserAuthController.login(req,res,next);
});
UserRoute.post('/authenticateUser',Authenticate,(req,res,next)=>{
    res.send(req.user);
});
UserRoute.post('/addUser',Authenticate,
check('name').not().isEmpty().withMessage('Name field is required'),
check('mobile').not().isEmpty().withMessage('Mobile field is required')
.custom((value,{ req }) => {
    return User.findOne({ $or : [{mobile: value},{alternateMobile:value}],deletedAt:null}) 
    .then((user) => {  
        if(user){
            return Promise.reject('Mobile has been already taken!!')
        }
    })
}),   
check('alternateMobile')
.custom((value,{ req }) => {
    if(value != '' || value != null){
        return User.findOne({ $or : [{mobile: value},{alternateMobile:value}],deletedAt:null}) 
        .then((user) => {  
            if(user){
                return Promise.reject('Alternate Mobile has been already taken!!')
            }
        })
    }
}),   
(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        Helper.response(false,'Validation Error!!',{errors:errors.array()},res,200);
    }else{
        UserAuthController.addUser(req,res,next);
    }
});
UserRoute.post('/userList',Authenticate,   
(req,res,next)=>{
    UserAuthController.userList(req,res,next);
});
UserRoute.post('/editUser',Authenticate,
check('id').not().isEmpty().withMessage('Id field is required'),
check('name').not().isEmpty().withMessage('Name field is required'),
check('mobile').not().isEmpty().withMessage('Mobile field is required')
.custom((value,{ req }) => {
    return User.findOne({ $or : [{mobile: value},{alternateMobile:value}],deletedAt:null}) 
    .then((user) => {  
        if(user && user._id != req.body.id){
            return Promise.reject('Mobile has been already taken!!')
        }
    })
 }),   
check('alternateMobile')
.custom((value,{ req }) => {
    if(value != '' || value != null){
        return User.findOne({ $or : [{mobile: value},{alternateMobile:value}],deletedAt:null}) 
        .then((user) => {  
            if(user && user._id != req.body.id){
                return Promise.reject('Alternate Mobile has been already taken!!')
            }
        })
    }
}),   
(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        Helper.response(false,'Validation Error!!',{errors:errors.array()},res,200);
    }else{
        UserAuthController.editUser(req,res,next);
    }
});
UserRoute.post('/deleteUser',Authenticate,
check('id').not().isEmpty().withMessage('Id field is required'),  
(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        Helper.response(false,'Validation Error!!',{errors:errors.array()},res,200);
    }else{
        UserAuthController.deleteUser(req,res,next);
    }
});

UserRoute.group("/followup", (UserRoute) => {
    UserRoute.post('/add',Authenticate,
    check('userId').not().isEmpty().withMessage('userId field is required!!'),
    check('type').not().isEmpty().withMessage('type field is required!!'),
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            Helper.response(false,'Validation Error!!',{errors:errors.array()},res,200);
        }else{
            FollowUpController.add(req,res,next);
        }
    });

    //Upcoming FollowUp/Visits
    UserRoute.post('/upcoming',Authenticate,
    check('type').not().isEmpty().withMessage('type field is Required!!'),
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            Helper.response(false,'Validation Error!!',{errors:errors.array()},res,200);
        }else{
            FollowUpController.upcoming(req,res,next);
        }
    });

    //Visits Done
    UserRoute.post('/visitDone',Authenticate,
    (req,res,next)=>{
        FollowUpController.visitDone(req,res,next);
    });

    //Missed Followups
    UserRoute.post('/missedFollowups',Authenticate,
    (req,res,next)=>{
        FollowUpController.missedFollowups(req,res,next);  
    });

    //Not Interested Users
    UserRoute.post('/notInterestedUsers',Authenticate,
    (req,res,next)=>{
        FollowUpController.notInterestedUsers(req,res,next);  
    });

    UserRoute.post('/allFollowups',Authenticate,
    (req,res,next)=>{
        FollowUpController.allFollowups(req,res,next);
    });


    UserRoute.post('/userReport',Authenticate,
    check('userId').not().isEmpty().withMessage('userId field is Required!!'),
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            Helper.response(false,'Validation Error!!',{errors:errors.array()},res,200);
        }else{
            FollowUpController.userReport(req,res,next);
        }
    });
});
  
module.exports = UserRoute;