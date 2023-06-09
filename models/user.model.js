const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const crypto= require("crypto");
const fuzzy = require("../utils/mongoose-fuzzy-search");


const UserSchema=new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
      },
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
     
      hashed_password: {
        type: String,
        required: false,
        select: false,
      },
      salt: {
        type: String,
        required: false,
        select: false,
      },
      resetPasswordLink: {
        type: String,
        required: false,
      },
},{timestamps:true})



UserSchema.virtual("password")
.set(async function(password){
    this.real_password = password
    this.salt = await this.makeSalt();
    this.hashed_password =  this.encryptPasswordFunc(password,this.salt);
})
.get(function(){
    return this.real_password
})

UserSchema.methods = {
    authentication(password){
       // check if encrypted password === this.hashed_password
    },

    encryptPasswordFunc(password,salt){
        // encrypt password using crypto 
        
    },
    makeSalt(){
        // make salt and return it
    }
}


UserSchema.plugin(fuzzy,{
  fields:{
    name_tag:"name" }
}
)
UserSchema.index({name_tag:1})


const User=mongoose.model('User',UserSchema)
module.exports=User