const express = require('express');
const router = express.Router();
const Users = require("../db/models/users");
const Response = require("../lib/Response");
const customError = require('../lib/Error');
const Enum = require('../config/Enum');
const bcrypt = require("bcrypt-nodejs");
const is = require("is_js");
const UserRoles = require("../db/models/UserRoles");
const Roles = require("../db/models/roles");
const config = require("../config");
const jwt = require("jwt-simple");
const auth = require("../lib/auth")();


router.post("/register", async (req,res,next)=>{
  try{
    let body = req.body;
    let user = await Users.findOne({});
    if(user){
      return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND);
    }

    if(!body.email) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","email field must be filled");
    if(!body.password) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","password field must be filled");
    if(!is.email(body.email)) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","email field must be an email format");
    if(body.password.length<Enum.HTTP_CODES){
      throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"vailation error","passwordd must be greater than" + Enum.PASS_LENGTH)
    }

    
    let password = bcrypt.hashSync(body.password,bcrypt.genSaltSync(8),null);

    


    let createdUser =await Users.create({
      email: body.email,
      password : password,
      isActive : true,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    });
    let role = await Roles.create({
      role_name:Enum.SUPER_ADMIN,
      isActive: true,
      createdBy: createdUser._id
    });

    await UserRoles.create({
      user_id:createdUser._id,
      role_id:role._id
    });


    res.status(Enum.HTTP_CODES.CREATED).json(Response.succesResponse({success:true},Enum.HTTP_CODES.CREATED));

     
  }catch(err){
    let errorResponse  = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


router.post("/auth" , async ( req,res,next)=>{
  try{
    let{email,password} = req.body;

    Users.validateFieldsBeforeAuth(email,password);
    let user = await Users.findOne({email});
    if(!user) throw new customError(Enum.HTTP_CODES.UNAUTHORIZED,"validation error","email or password is wrong");

    if(!user.validPassword(password)) throw new customError(Enum.HTTP_CODES.UNAUTHORIZED,"validation error","wrong email or password");

    let payload = {
      id:user._id,
      exp:parseInt(Date.now()/1000) * config.JWT.EXPIRE_TIME
    }

    let token = jwt.encode(payload,config.JWT.SECRET);

    let userData = {
      _id : user._id,
      first_name : user.first_name,
      last_name : user.last_name
    }

    res.json(Response.succesResponse({token,user:userData}));
    
  }catch(err){
    let errorResponse  = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }


});



router.all("*",auth.authenticate(),(req,res,next)=>{
    next();
});




router.get('/',auth.checkRoles("user_view"), async (req, res, next)=> {
  try{
    let users = await Users.find({},{password:0}).lean();
    for(let i =0;i<users.length;i++){
      let roles = await UserRoles.find({user_id:users[i]._id});
      users[i].roles = roles;
    }


    res.json(Response.succesResponse(users));
  }catch(err){
    let errorResponse  = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/add",auth.checkRoles("user_add"), async (req,res,next)=>{
  try{
    let body = req.body;
      
    if(!body.email) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","email field must be filled");
    if(!body.password) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","password field must be filled");
    if(!is.email(body.email)) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","email field must be an email format");
    if(body.password.length<Enum.PASS_LENGTH){
      throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"vailation error","passwordd must be greater than" + Enum.PASS_LENGTH)
    }

    if(!body.roles || !Array.isArray(body.roles)|| body.roles.length == 0){
      throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","roles field must be filled!");
    }

    let roles = await Roles.find({_id:{$in: body.roles}});

    if (roles.length == 0){
       throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","roles field must be filled!");
    }

    let password = bcrypt.hashSync(body.password,bcrypt.genSaltSync(8),null);

    let user = await Users.create({
      email: body.email,
      password : password,
      isActive : true,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    });

    for(let i = 0;i<roles.length;i++){
      await UserRoles.create({
        role_id:roles[i]._id,
        user_id : user._id
      });
    }



    res.status(Enum.HTTP_CODES.CREATED).json(Response.succesResponse({success:true},Enum.HTTP_CODES.CREATED));

     
  }catch(err){
    let errorResponse  = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update",auth.checkRoles("user_update"), async(req,res,next)=>{
  try{
    let body = req.body;
    let updates ={};
    if(!body._id) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","id field must be filled");

    if(body.password && body.password.length >= Enum.PASS_LENGTH){
      updates.password = bcrypt.hashSync(body.password,bcrypt.genSalt(8),null);
    }
    if(body.first_name) updates.first_name = body.first_name;
    if(body.last_name) updates.last_name = body.last_name;
    if(body.phone_number) updates.phone_number = body.phone_number;
    if(typeof body.isActive === "boolean") updates.isActive = body.isActive;
    
    if(body._id == req.user.id){
      body.roles=null;
    }





    if( Array.isArray(body.roles) && body.roles.length > 0){
      let userRoles = await UserRoles.find({user_id : body._id});

      let removedRoles = userRoles.filter(x=>!body.roles.includes(x.role_id));
      let newRoles = body.roles.filter(x=>!userRoles.map(p=>p.role_id).includes(x));
      
      if(removedRoles.length>0){
        await UserRoles.deleteMany({_id:{$in:removedRoles.map(p=>p._id.toString())}});
      }
      
      if(newRoles>0){
        for(let i =0;i< newRoles.length;i++){
            let priv = new UserRoles({
              role_id : newRoles[i],
              user_id:body._id
            })
      
            await priv.save();
          }            
        }




    }

    let roles = await Roles.find({_id:{$in: body.roles}});

    if (roles.length == 0){
       throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","roles field must be filled!");
    }


    await Users.updateOne({_id:body._id},updates);

    res.status(Enum.HTTP_CODES.CREATED).json(Response.succesResponse({success:true},Enum.HTTP_CODES.CREATED));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/delete",auth.checkRoles("user_delete"), async(req,res,next)=>{
  try{
    let body = req.body;

    
    if(!body._id) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error","id field must be filled");
    await Users.deleteOne({_id:body._id});
    await UserRoles.deleteMany({user_id:body._id});

    res.json(Response.succesResponse({success:true}));
  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});



module.exports = router;
