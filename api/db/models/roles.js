const mongoose = require("mongoose");
const rolePrivilage = require("./rolePrivilage");

const schema = mongoose.Schema({
    role_name:{type: String,required : true},
    isActive : {type: Boolean,default :true},
    createdBy : {type: mongoose.Schema.Types.ObjectId}

},{
    versionKey:false,
    timestamps:{
        createdAt:"created_at",
        updatedAt: "updated_at"
    }
})

class roles extends mongoose.model{
    static async remove (query){

        if(query._id){
            await rolePrivilage.remove({role_id:query._id});
        }

        await super.remove(query);
    }
}

schema.loadClass(roles);
module.exports = mongoose.model("roles",schema);
