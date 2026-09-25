const Enum = require("../config/Enum");
const customError = require("./Error");

class Response{
    constructer(){}

    static succesResponse(data,code=200){
        return{
            code,
            data
        }
    }

    static errorResponse(error){
        if(error instanceof customError){
            return{
                code:error.code,
                error:{
                    message: error.message,
                    description : error.description


                }
            }
        }

        return{
            code:Enum.HTTP_CODES.INT_SERVER_ERROR,
            error:{
                message: error.message,
                description : error.message


            }
        }


            
    } 
}

module.exports = Response;