const mongoose = require("mongoose");

const schema = mongoose.Schema({
   level: String,
   email:String,
   location:String,
   proc_type: String,
   log: mongoose.Schema.Types.Mixed

},{
    timestamps:{
        createdAt:"created_at",
        updatedAt: "updated_at"
    }
})

class auditLogs extends mongoose.model{
    
}

schema.loadClass(auditLogs);
module.exports = mongoose.model("auditLogs",schema);
