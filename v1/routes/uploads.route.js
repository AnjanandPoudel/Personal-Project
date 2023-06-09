
const { validate, validateOpt } = require('../../middlewares/validate')
const { validator } = require('../../middlewares/validator')
const { getRooms, getRoom, postRoom, patchRoom, deleteRoom } = require('../controllers/room.controller')

const router =  require('express').Router({mergeParams:true})


router.post('/',validate([""]),validator )


module.exports=router