const express = require('express');
const router = express.Router();
const Categories = require("../db/models/categories");
const Response = require("../lib/Response");
const customError = require("../lib/Error");
const Enum = require("../config/Enum");

const auditLogs = require("../lib/AuditLogs");
const logger = require("../lib/Logger/LoggerClass");
const auth = require("../lib/auth")();
const emitter = require("../lib/Emitter");
const excellExport = new (require("../lib/Export"))();
const fs= require("fs");

const multer = require("multer");
const config = require("../config");
const  path  = require("path");
const Import = new (require("../lib/Import"))();

let multerStorage = multer.diskStorage({
  destination: (req,res,next)=>{
    next(null,config.FILE_UPLOAD_PATH)
  },
  filename: (req,file,next) =>{
    next(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

const upload = multer({storage:multerStorage}).single("pb_file");

router.all("*",auth.authenticate(),(req,res,next)=>{
    next();
});

/* GET categories listing. */
router.get('/',auth.checkRoles("category_view"), async(req, res, next)=> {

  try{
    let categories = await Categories.find({});
    res.json(Response.succesResponse(categories));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }

  
});

router.post("/add",auth.checkRoles("category_add"), async(req,res,next) =>{
  let body =  req.body;
  try{
    if(!body.name) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error!","name field must be filled");

    let category = new Categories({
      name:body.name,
      isActive : true,
      created_by : req.user?.id
    })

    await category.save();

    auditLogs.info(req.user?.email,"Categories","add",category);
    emitter.getEmitter("notifications").emit("messages",{message : category.name + "is added"});

    res.json(Response.succesResponse({succes:true}));

  }catch(err){
    logger.error(req.user?.email,"Categories","add",err);
    
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


router.post("/update",auth.checkRoles("category_update"),async(req,res,next)=>{
  try{
    let body= req.body;
    if(!body._id) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error!","id field must be filled");
    let updates = {};
    if(body.name) updates.name = body.name;
    if(typeof body.isActive === "boolean")  updates.isActive = body.isActive;

    await Categories.updateOne({_id:body._id},updates);

    auditLogs.info(req.user?.email,"Categories","update",{_id:body._id,updates});
    res.json(Response.succesResponse({succes:true}));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
})

router.post("/delete",auth.checkRoles("category_delete"),async(req,res,next)=>{
  let body = req.body;

  try{
    if(!body._id) throw new customError(Enum.HTTP_CODES.BAD_REQUEST,"validation error!","id field must be filled");
    
    await Categories.remove({_id : body._id});

    auditLogs.info(req.user?.email,"Categories","delete",{_id:body._id});
    res.json(Response.succesResponse({succes:true}));
  }catch(err){
     let errorResponse = Response.errorResponse(err);
     res.status(errorResponse.code).json(errorResponse);
  }
})


router.post("/export",auth.checkRoles("category_export"), async (req,res) =>{
  try{
    let categories = await Categories.find({});
    
    let excell = excellExport.toExcel(
      ["NAME","IS_ACTIVE","USER_ID"],
      ["name","isActive","createdBy"],
      categories
    )

    let FilePath = __dirname+"../tmp/categories_excel_" + Date.now()+".xlsx";


    fs.writeFileSync(FilePath,excell,"UTF-8");
    res.download(FilePath);

    fs.unlinkSync(FilePath);




  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

router.post("/import",auth.checkRoles("category_add") ,async(req,res)=>{
  try{
    let file = req.file;
    let body = req.body;

    let rows =Import.fromExcell(file.path);

    for(let i= 1;i<rows.length;i++){
      let[name,isActive,user,] = rows[i];
      if(name){
          await Categories.create({
            name,
            isActive,
            createdBy : req.user._id
          });
      } 
      await Categories.create({
        name,
        isActive,
        createdBy : req.user._id
      });
      
      
    }

    res.status(Enum.HTTP_CODES.CREATED).json(Response.succesResponse(req.body,Enum.HTTP_CODES.CREATED));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(Response.errorResponse(err));
  }
});

module.exports = router;


