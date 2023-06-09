const {
  validate,
  validateOpt,
  getMethodValidate,
} = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

const express = require("express");
const {
  getrestaurantReviews,
  getReview,
  deleteReview,
  postReviewController,
  patchReviewController,
  getMyReviewInrestaurant,
} = require("../../controllers/review.controller");
const {
  checkAuthentication,
} = require("../../middlewares/checkAuthentication");
const { isUser } = require("../../middlewares/checkUserType");
const { checkExistance } = require("../../middlewares/checkExistance");
const restaurant = require("../../../models/restaurant.model");

const router = express.Router({ mergeParams: true });

router.get("/", getMethodValidate(), validator, getrestaurantReviews);

router.get(
  "/my-reviews",
  isUser(),
  validate(["restaurantId"]),
  validator,
  getMyReviewInrestaurant
);
router.get("/:reviewId", validate(["reviewId"]), validator, getReview);

router.post(
  "/",
  isUser(),
  validate(["review", "rating", "restaurantId"]),
  validator,
  // checkExistance(restaurant, [
  //   {
  //     key: "_id",
  //     value: "params.restaurantId",
  //   },
  // ]),
  postReviewController
);

router.patch(
  "/:reviewId",
  isUser(),
  validate(["reviewId", "restaurantId"]),
  validateOpt(["review", "rating"]),
  validator,
  patchReviewController
);

router.delete(
  "/:reviewId",
  isUser(),
  validate(["reviewId", "restaurantId"]),
  validator,
  deleteReview
);

module.exports = router;
