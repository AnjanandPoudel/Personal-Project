
const { validate, validateOpt, getMethodValidate } = require('../middlewares/validate')
const { validator } = require('../middlewares/validator')
const { getdishType, getdishTypes, postdishType, patchdishType, deletedishType } = require('../controllers/dish.controller')


const router =  require('express').Router({mergeParams:true})



router.get('/',getMethodValidate(),validator,getdishTypes)
router.get('/:dishTypeId',validate(["dishTypeId"]),validator,getdishType)


router.post('/',validate(["type","description"]),validator,postdishType )

router.patch('/:dishTypeId',validate(["dishTypeId"]) ,validateOpt(["type","description"]) ,  validator , patchdishType)


router.delete('/:dishTypeId',validate(["dishTypeId"]) , validator , deletedishType)





module.exports=router