
const router =  require('express').Router({mergeParams:true})

const adminRouter = require("./admin.route");
const userRouter = require("./user.route");
const restaurantRouter = require("./restaturant.route");
const dishpackRouter = require("./dishdishpack.route");
const dishRouter = require("./dish.route");
const locationRouter = require("./location.route");


router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/restaurant", restaurantRouter);
router.use("/dishpack", dishpackRouter);
router.use("/dish-type", dishRouter);
router.use("/location", locationRouter);

module.exports=router