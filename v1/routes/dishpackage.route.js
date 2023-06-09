
const { validate, validateOpt, getMethodValidate } = require('../middlewares/validate')
const { validator } = require('../middlewares/validator')


const express=require("express")
const { getdishpacks, postdishpack, getdishpack, patchdishpack, deletedishpackController, getdishpacksForDropDown } = require('../controllers/dishpack.controller')
const router =  express.Router({mergeParams:true})


router.get('/',getMethodValidate(),validator,getdishpacks)
router.get('/dropdown',validator,getdishpacksForDropDown)
router.get('/:dishpackId',validate([""]),validator,getdishpack )

router.post('/',validate(["name","description","price"]) , validator , postdishpack)

router.patch('/:dishpackId',validate(["dishpackId"]),validateOpt(["name","description","price"]) , validator , patchdishpack)


router.delete('/:dishpackId',validate(["dishpackId"]) , validator , deletedishpackController)


module.exports=router