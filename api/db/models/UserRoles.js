const mongoose = require("mongoose");
const roles = require("./roles");
const users = require("./users");


const schema = mongoose.Schema({
   role_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:roles},
   user_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:users}

},{
    timestamps:{
        createdAt:"created_at",
        updatedAt: "updated_at"
    }
})

class UserROLES extends mongoose.model{
    
}

schema.loadClass(UserROLES);
module.exports = mongoose.model("UserRoles",schema);
