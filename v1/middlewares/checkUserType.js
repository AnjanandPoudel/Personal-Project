const Admin = require("../../models/admin.model")
const User = require("../../models/user.model")
const { SetErrorResponse } = require("../../utils/responseSetter")
const { checkAuthentication, AuthTokenParser } = require("./checkAuthentication")





async function checkUserType  (req,res,next){
    try {
        const userId=res.locals.authData?._id
        const admin=await Admin.findOne({_id:userId}).lean()
        res.locals.admin=admin
        const user=await User.findOne({_id:userId}).lean()
        res.locals.user=user
        // console.log({
        //     user:res.locals.user,
        //     admin:res.locals.admin
        // })
        if(admin){
            res.locals.userType="admin"
            // console.log("You are Admin")

        }
        else if(user){
            res.locals.userType="user"
            // console.log("You are User")

        }
    
        next()
    }
    catch (error) {
        res.fail(error)
    }
}



function ForAdmin(req,res,next) {
    try {
       
        if(res.locals.userType==="admin"){
           return next()
        }
        throw new SetErrorResponse("You are not Admin",401)
    }
    catch (error) {
        res.fail(error)
    }
}
function ForUser(req,res,next) {
    try {
        if(res.locals.userType==="user"){
           return next()
        }
        throw new SetErrorResponse("You must be User",401)
    }
    catch (error) {
        res.fail(error)
    }
}

function isAdmin() {
  
    return [checkAuthentication(),
        checkUserType,ForAdmin];
}
function isUser() {
    return [  checkAuthentication(),
        checkUserType,ForUser];
  }

function checkUserTypes(){
    return[
        AuthTokenParser(),
        checkUserType
    ]
}

  module.exports = {
    isAdmin,isUser,checkUserTypes
  };
  
  