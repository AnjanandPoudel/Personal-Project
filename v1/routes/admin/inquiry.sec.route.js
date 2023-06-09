const express = require("express");
const { patchInquiryByAdmin, getrestaurantUserInquiries } = require("../../controllers/inquiry.controller");
const router = express.Router({ mergeParams: true });

//controllers

const { isAdmin } = require("../../middlewares/checkUserType");

//middlewares
const {
  validate,
  validateOpt,
  getMethodValidate,
} = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

//API

// router.get(
//   "/",
//   getMethodValidate(),
//   validate([""]),
//   validator,
//   isAdmin(),
//   getrestaurantUserInquiries
// );
router.get(
  "/",
  getMethodValidate(),
  validate([""]),
  validator,
  // isAdmin(),
  getrestaurantUserInquiries
);

router.patch(
  "/:mark-as-read",
  isAdmin(),
  validate(["markAsRead","restaurantId"]),
  validator,
  patchInquiryByAdmin
);

module.exports = router;
