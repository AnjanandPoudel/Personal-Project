
const { validate, validateOpt, getMethodValidate } = require('../middlewares/validate')
const { validator } = require('../middlewares/validator')
const { getRoomType, getRoomTypes, postRoomType, patchRoomType, deleteRoomType } = require('../controllers/room.controller')


const router =  require('express').Router({mergeParams:true})



router.get('/',getMethodValidate(),validator,getRoomTypes)
router.get('/:roomTypeId',validate(["roomTypeId"]),validator,getRoomType)


router.post('/',validate(["type","description"]),validator,postRoomType )

router.patch('/:roomTypeId',validate(["roomTypeId"]) ,validateOpt(["type","description"]) ,  validator , patchRoomType)


router.delete('/:roomTypeId',validate(["roomTypeId"]) , validator , deleteRoomType)





module.exports=router