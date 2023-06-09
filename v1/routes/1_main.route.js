
const router =  require('express').Router({mergeParams:true})

const adminRouter = require("./admin.route");
const userRouter = require("./user.route");
const hotelRouter = require("./hotel.route");
const packageRouter = require("./package.route");
const roomRouter = require("./room.route");
const locationRouter = require("./location.route");


router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/hotel", hotelRouter);
router.use("/package", packageRouter);
router.use("/room-type", roomRouter);
router.use("/location", locationRouter);

module.exports=router