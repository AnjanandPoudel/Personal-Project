
const express=require("express");
const router =  express.Router({mergeParams:true})


//controllers
const { getrestaurantsInLocation } = require("../../controllers/restaurant.controller");


//middlewares
const { getMethodValidate } = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");



//API
router.get("/", getMethodValidate(), validator, getrestaurantsInLocation);

module.exports=router