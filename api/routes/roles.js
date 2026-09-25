const express = require('express');
const router = express.Router();

const Roles = require("../db/models/roles");
const rolePrivilage = require("../db/models/rolePrivilage");
const Response = require('../lib/Response');
const customError = require('../lib/Error');
const Enum = require("../config/Enum");
const role_privilages = require("../config/rolePrivilage");
const auth = require("../lib/auth")();
const UserRoles = require("../db/models/UserRoles");

router.all("*",auth.authenticate(),(req,res,next)=>{
    next();
});

router.get("/",auth.checkRoles("role_view"),async (req,res,next)=>{
    try{
        let roles = await Roles.find({}).lean();

        for(let i= 0;i<roles.length;i++){
            let permissions = await rolePrivilage.find({role_id:roles[i]._id});
            roles[i].permissions = permissions;
        }
        res.json(Response.succesResponse(roles));
    }catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
})

router.post("/add",auth.checkRoles("role_add"),async (req,res,next)=>{
    let body = req.body;
    try{

        if(!body.role_name) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error!","name field must be filled");
        if(!body.permissions || !Array.isArray(body.permissions)||body.permissions.length == 0 ){
            throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error!","permissions field must be filled");
        }


        let role = new Roles({
            role_name: body.role_name,
            isActive : true,
            created_by : req.user?.id
        })

        await role.save();

        for(let i =0;i< body.permissions.length;i++){
            let priv = new rolePrivilage({
                role_id : role._id,
                permission:body.permissions[i],
                created_by :req.user?.id
            })

            await priv.save();
        }

        res.json(Response.succesResponse({succes:true}));
    }catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/update",auth.checkRoles("role_update"),async (req,res,next)=>{
    let body = req.body;
    try{

        if(!body._id) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error!","id field must be filled");

        let UserRole = await UserRoles.findOne({user_id:req.user.id , role_id:body.id})
        if(UserRole){
            throw new customError(Enum.HTTP_CODES.FORBIDDEN,"permission error","need permission");
        }
        let updates = {};

        if(body.role_name) updates.role_name = body.role_name;
        if(typeof body.isActive === "boolean") updates.isActive = body.isActive;
        if(body.permissions && Array.isArray(body.permissions)&&body.permissions.length > 0 ){

            let permissions = await  rolePrivilage.find({role_id:body._id});
            let removedPermissions = permissions.filter(x=>!body.permissions.includes(x.permissions));
            let newPermissions = body.permissions.filter(x=>!permissions.map(p=>p.permission).include(x));

            if(removedPermissions.length>0){
                await rolePrivilage.remove({_id:{$in:removedPermissions.map(p=>p._id)}});
            }

            if(newPermissions.length > 0){
                for(let i =0;i< newPermissions.length;i++){
                    let priv = new rolePrivilage({
                        role_id : body._id,
                        permission:newPermissions[i],
                        created_by :req.user?.id
                    })

                    await priv.save();
                }            
            }

            
        }

        await Roles.updateOne({_id:body._id},updates);

        res.json(Response.succesResponse({succes:true}));

    }catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
})

router.post("/delete",auth.checkRoles("role_delete"),async (req,res,next)=>{
    let body = req.body;
    try{

        if(!body._id) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error!","id field must be filled");

        
        await Roles.remove({_id:body._id});
        

        
        res.json(Response.succesResponse({succes:true}));
    }catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.get("/role_privilages",async (req,res,next)=>{
    res.json(Response.succesResponse(role_privilages));
})


module.exports = router;