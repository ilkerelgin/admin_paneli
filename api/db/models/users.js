const mongoose = require("mongoose");
const{PASS_LENGTH,HTTP_CODES} = require("../../config/Enum");
const is = require("is_js");
const customError = require("../../lib/Error");
const bcrypt = require("bcrypt-nodejs");


const schema = mongoose.Schema({
    email: {type:String,required : true},
    password: {type:String,required : true},
    isActive: {type:Boolean,default:true},
    first_name: String,
    last_name: String,
    phone_number: String

},{
    versionKey : false,
    timestamps:{
        createdAt:"created_at",
        updatedAt: "updated_at"
    }
})

class users extends mongoose.model{

     validPassword(password){
        return bcrypt.compareSync(password,this.password);
    }




    static validateFieldsBeforeAuth(email,password){
        if(typeof password !== "string" || password.length < PASS_LENGTH ||is.not.email(email)){
            throw new customError(HTTP_CODES.UNAUTHORIZED,"validation error","email or password is wrong");
        }
        return null;
    }
}

schema.loadClass(users);
module.exports = mongoose.model("users",schema);
