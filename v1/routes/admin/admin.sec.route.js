const express = require("express");
const router = express.Router({ mergeParams: true });

const { getrestaurantUsers } = require("../../controllers/inquiry.controller");
const { isAdmin } = require("../../middlewares/checkUserType");
const {
  validate,
  validateOpt,
  getMethodValidate,
} = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

const inquiryRouter = require("./inquiry.sec.route");


router.get("/", getMethodValidate(), validator, isAdmin(), getrestaurantUsers);





router.use("/inquiry", isAdmin(), inquiryRouter);
module.exports = router;
