const mongoose = require("mongoose");

const schema = mongoose.Schema({
   permission:{type:String,required:true},
   role_id :{type:mongoose.Schema.Types.ObjectId,required:true},
   created_by:{type:mongoose.Schema.Types.ObjectId}

},{
    timestamps:{
        createdAt:"created_at",
        updatedAt: "updated_at"
    }
})

class rolePrivilage extends mongoose.model{
    
}

schema.loadClass(rolePrivilage);
module.exports = mongoose.model("rolePrivilage",schema);
