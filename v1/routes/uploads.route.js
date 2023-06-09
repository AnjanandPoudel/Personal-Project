
const { validate, validateOpt } = require('../../middlewares/validate')
const { validator } = require('../../middlewares/validator')
const { getdishs, getdish, postdish, patchdish, deletedish } = require('../controllers/dish.controller')

const router =  require('express').Router({mergeParams:true})


router.post('/',validate([""]),validator )


module.exports=router