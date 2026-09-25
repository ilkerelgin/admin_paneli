const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name : {type:String,required: true},
    isActive: {type:Boolean,default:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId}

},{
    timestamps:{
        createdAt:"created_at",
        updatedAt: "updated_at"
    }
})

class categories extends mongoose.model{
    
}

schema.loadClass(categories);
module.exports = mongoose.model("categories",schema);
