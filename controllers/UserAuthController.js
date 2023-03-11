const UserAuthController = {};
const Helper = require('../helper/Helper');
const User = require('../models/User');
UserAuthController.login = async (req,res,next) =>{
    try{
        const { email,password } = req.body;
        if(email == process.env.APP_LOGIN_USERNAME && password == process.env.APP_LOGIN_PASSWORD){
            const token = await Helper.createJWTSign(email);
            const userData = {token:token}
            Helper.response(true,'User has been login Successfully!!',userData,res,200);
        }else{
            Helper.response(false,'Invalid Username or Password!!',{},res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
};

UserAuthController.addUser = async(req,res,next) => {
    try {
        const { name,email,mobile,alternateMobile } = req.body;
        const user = User({
            name:name,
            mobile:mobile,
            alternateMobile:alternateMobile,
            email:email
        });
        await user.save();
        Helper.response(true,'User has been added Successfully!!',user,res,200);
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}

UserAuthController.userList = async (req,res,next) => {
    try {
        const user = await User.find({deletedAt:null}).sort({createdAt:-1}).select("-__v");
        if(user.length < 1){
            Helper.response(false,'No User Found!!',{},res,200);
        }else{
            Helper.response(true,'User list has been get Successfully!!',user,res,200);
        }
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}

UserAuthController.editUser = async (req,res,next) =>{
    try{
        const { id,name,email,mobile,alternateMobile } = req.body;
        const user = await User.findByIdAndUpdate(
            { _id: id },
            { name:name,email:email,mobile:mobile,alternateMobile:alternateMobile,updatedAt:Helper.currentTimeStamp() },
            { runValidator: true, useFindAndModify: false, new: true }
        );
        Helper.response(true,'User has been added Successfully!!',user,res,200);
    } catch (error) {
        console.log(error);
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}


UserAuthController.deleteUser = async (req,res,next) =>{
    try{
        const { id } = req.body;
        const user = await User.findByIdAndUpdate(
            { _id: id },
            { deletedAt:Helper.currentTimeStamp() },
            { runValidator: true, useFindAndModify: false, new: true }
        );
        Helper.response(true,'User has been deleted Successfully!!',user,res,200);
    } catch (error) {
        Helper.response(false,'Some Error Occured!!',{errors:error},res,200);
    }
}



module.exports = UserAuthController;