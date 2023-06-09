const {
  getrestaurants,
  postrestaurantController,
  getrestaurant,
  deleterestaurant,
  patchrestaurantController,
  patchrestaurantCoverImageController,
  patchrestaurantRelatedImagesController,
  putAllrestaurant,
  getrestaurantName,
} = require("../controllers/restaurant.controller");

const { uploadImages } = require("../middlewares/multerfile");
const {
  validate,
  validateOpt,
  getMethodValidate,
  validateArray,
} = require("../middlewares/validate");
const { validator } = require("../middlewares/validator");

const dishpackRouter = require("./secondary/dishpack.sec.route");
const dishRouter = require("./secondary/dish.sec.route");
const reviewRouter = require("./secondary/review.sec.route");
const userRouter = require("./_user/user.sec.route");
const adminRouter = require("./admin/admin.sec.route");
const {  isAdmin } = require("../middlewares/checkUserType");
const { checkExistance } = require("../middlewares/checkExistance");
const dishType = require("../../models/dishType.model");

const router = require("express")();

router.get(
  "/",
  getMethodValidate(),
  validateOpt(["locationId","rating","dishTypeId"]),
  validator,
  getrestaurants
);
router.get("/:restaurantId", validate(["restaurantId"]), validator, getrestaurant);
// router.get("/:restaurantId/restaurant-name", validate(["restaurantId"]), validator, getrestaurantName);

router.post(
  "/",
  isAdmin(),
  uploadImages({
    secondaryPath: "/homestay/restaurant",
    singleName: "coverImage",
  }),
  validate([
    "name",
    "parking",
    "noOfdishs",
    "locationId",
    "checkInTime",
    "checkOutTime",
    "phoneNumber",
    "secondaryPhoneNumber",
    "latitude",
    "longitude",
    "description"
  ]),
  validateOpt(["email",]),
  validateArray(["dishs", "dishpacks"]),
  validator,
  postrestaurantController
);


module.exports = router;
