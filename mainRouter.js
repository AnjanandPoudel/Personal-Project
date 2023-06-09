
const router =  require('express').Router({mergeParams:true})

const v1Router=require('./v1/routes/1_main.route')

router.use('/version1', v1Router);


module.exports=router