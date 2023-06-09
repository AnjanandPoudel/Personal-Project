const {
  validate,
  validateOpt,
  getMethodValidate,
} = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

const express = require("express");
const {
  reviewForApproval,
  approveReview,
} = require("../../controllers/review.controller");
const { checkAuthentication } = require("../../middlewares/checkAuthentication");
const { isAdmin } = require("../../middlewares/checkUserType");

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  checkAuthentication(),
  isAdmin(),
  getMethodValidate(),
  validator,
  reviewForApproval
);

router.patch(
  "/:reviewId",
  checkAuthentication(),
  isAdmin(),
  validate(["reviewId"]),
  validateOpt(["name", "description", "price"]),
  validator,
  approveReview
);






module.exports = router;
