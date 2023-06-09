const {
  validate,
  validateOpt,
  getMethodValidate,
} = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

const express = require("express");
const {
  getHotelReviews,
  getReview,
  deleteReview,
  postReviewController,
  patchReviewController,
  getMyReviewInHotel,
} = require("../../controllers/review.controller");
const {
  checkAuthentication,
} = require("../../middlewares/checkAuthentication");
const { isUser } = require("../../middlewares/checkUserType");
const { checkExistance } = require("../../middlewares/checkExistance");
const Hotel = require("../../../models/hotel.model");

const router = express.Router({ mergeParams: true });

router.get("/", getMethodValidate(), validator, getHotelReviews);

router.get(
  "/my-reviews",
  isUser(),
  validate(["hotelId"]),
  validator,
  getMyReviewInHotel
);
router.get("/:reviewId", validate(["reviewId"]), validator, getReview);

router.post(
  "/",
  isUser(),
  validate(["review", "rating", "hotelId"]),
  validator,
  // checkExistance(Hotel, [
  //   {
  //     key: "_id",
  //     value: "params.hotelId",
  //   },
  // ]),
  postReviewController
);

router.patch(
  "/:reviewId",
  isUser(),
  validate(["reviewId", "hotelId"]),
  validateOpt(["review", "rating"]),
  validator,
  patchReviewController
);

router.delete(
  "/:reviewId",
  isUser(),
  validate(["reviewId", "hotelId"]),
  validator,
  deleteReview
);

module.exports = router;
