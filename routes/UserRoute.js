const express = require("express");
const Authenticate = require('../middleware/Authenticate');
var UserRoute = express.Router();
const UserAuthController = require('../controllers/UserAuthController');
const Helper = require('../helper/Helper');
const User = require('../models/User');
const { check,body,validationResult} = require('express-validator');

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
    return User.findOne({mobile: value})
    .then((user) => {  
        if(user){
            return Promise.reject('Mobile has been already taken!!')
        }
    })
 }),   
(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        Helper.response(false,'Some Error Occured!!',{errors:errors.array()},res,200);
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
    return User.findOne({mobile: value})
    .then((user) => {  
        if(user && user._id != req.body.id){
            return Promise.reject('Mobile has been already taken!!')
        }
    })
 }),   
(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        Helper.response(false,'Some Error Occured!!',{errors:errors.array()},res,200);
    }else{
        UserAuthController.editUser(req,res,next);
    }
});
UserRoute.post('/deleteUser',Authenticate,
check('id').not().isEmpty().withMessage('Id field is required'),  
(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        Helper.response(false,'Some Error Occured!!',{errors:errors.array()},res,200);
    }else{
        UserAuthController.deleteUser(req,res,next);
    }
});
  
module.exports = UserRoute;