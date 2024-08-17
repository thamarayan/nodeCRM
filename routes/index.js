var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var multer = require("multer");
const path = require("path");

var Client = require("../models/client");

// Database Connection
mongoose.connect(
  "mongodb+srv://ragav:ragavSvks@cluster-products-api.nar65.mongodb.net/"
);

const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(413).json("File Size exceeds Limit");
  } else {
    next()
  }
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only .png / .jpg / .pdf files are allowed'))
  }
};

var upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/submitClientData", upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "license", maxCount: 1 },
  ]),fileSizeLimitErrorHandler,
  function (req, res, next) {
    var obj = Object.assign({}, req.files);

    if (obj.aadhar) {
      var path1 = obj.aadhar[0].path;
    }
    if (obj.pan) {
      var path2 = obj.pan[0].path;
    }
    if (obj.passport) {
      var path3 = obj.passport[0].path;
    }
    if (obj.license) {
      var path4 = obj.license[0].path;
    }

    var clientt = new Client({
      name: req.body.nameField,
      email: req.body.emailField,
      address: req.body.addressField,
      dob: req.body.dobField,
      contact: req.body.contactField,
      qualification: req.body.qualificationField,
      aadhar: path1,
      pan: path2,
      passport: path3,
      license: path4,
    });

    clientt.save().then((err, ress) => {
      if (err) {
        console.log(err);
      }
      console.log(ress);
      res.redirect("/");
    });
  }
);

router.get("/admin", function (req, res, next) {

  Client.find().then((result)=>{
    // console.log(result);
    res.render("adminLogin", { title: "Admin | Node CRM", clients:result });
  }).catch((err)=>{
    console.log("Error is " + err);
  });
    
})

router.get("/database", function (req, res, next) {

  Client.find().then((result)=>{
    // console.log(result);
    res.render("database", { title: "Database | Node CRM", clients:result });
  }).catch((err)=>{
    console.log("Error is " + err);
  });
    
})

router.get('/approve/:id', function(req,res,next){
  var id = req.params.id;

  Client.findByIdAndUpdate(id, { 
    $set : { 'status': true }}).then(()=>{
      res.redirect('/admin');
    }).catch(err=>{
      console.log(err);
    })
})

router.get('/revoke/:id', function(req,res,next){
  var id = req.params.id;

  Client.findByIdAndUpdate(id, { 
    $set : { 'status': false }}).then(()=>{
      res.redirect('/admin');
    }).catch(err=>{
      console.log(err);
    })
})

router.post('/searchProfile', async function(req,res,next){
  var searchKey = req.body.key;
  let search = await Client.find({name:{$regex: searchKey , "$options" : "i"}}).exec();
  res.render("database", { title: "Database | Node CRM", clients:search });
})


module.exports = router;
