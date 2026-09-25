const mongoose = require("mongoose");
let instance = null;
class database{
    constructor(){
        if(!instance){
            this.mongoConnection = null;
            instance = this;
        }

        return instance;
    }

    async connect(options){
        console.log("db connecting..");
        let db = await mongoose.connect(options.CONNECTION_STRING);
        this.mongoConnection = db;
        console.log("db connected");
    }
}

module.exports =  database;