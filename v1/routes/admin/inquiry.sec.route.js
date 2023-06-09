const express = require("express");
const { patchInquiryByAdmin, getHotelUserInquiries } = require("../../controllers/inquiry.controller");
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
//   getHotelUserInquiries
// );
router.get(
  "/",
  getMethodValidate(),
  validate([""]),
  validator,
  // isAdmin(),
  getHotelUserInquiries
);

router.patch(
  "/:mark-as-read",
  isAdmin(),
  validate(["markAsRead","hotelId"]),
  validator,
  patchInquiryByAdmin
);

module.exports = router;
