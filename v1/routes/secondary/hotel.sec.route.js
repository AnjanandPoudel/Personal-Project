
const express=require("express");
const router =  express.Router({mergeParams:true})


//controllers
const { getHotelsInLocation } = require("../../controllers/hotel.controller");


//middlewares
const { getMethodValidate } = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");



//API
router.get("/", getMethodValidate(), validator, getHotelsInLocation);

module.exports=router