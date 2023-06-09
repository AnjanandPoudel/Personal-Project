
const { validate, validateOpt, getMethodValidate } = require('../middlewares/validate')
const { validator } = require('../middlewares/validator')


const express=require("express")
const { getPackages, postPackage, getPackage, patchPackage, deletePackageController, getPackagesForDropDown } = require('../controllers/package.controller')
const router =  express.Router({mergeParams:true})


router.get('/',getMethodValidate(),validator,getPackages)
router.get('/dropdown',validator,getPackagesForDropDown)
router.get('/:packageId',validate([""]),validator,getPackage )

router.post('/',validate(["name","description","price"]) , validator , postPackage)

router.patch('/:packageId',validate(["packageId"]),validateOpt(["name","description","price"]) , validator , patchPackage)


router.delete('/:packageId',validate(["packageId"]) , validator , deletePackageController)


module.exports=router