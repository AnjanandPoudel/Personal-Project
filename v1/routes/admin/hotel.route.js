/* const {
  getrestaurants,
  postrestaurantController,
  getrestaurant,
  deleterestaurant,
  patchrestaurantController,
  
} = require("../../controllers/restaurant.controller");



const { uploadImages } = require("../../middlewares/multerfile");
const { validate, validateOpt, getMethodValidate, validateArray } = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

const dishpackRouter = require("../secondary/dishpack.sec.route");
const dishRouter = require("../secondary/dish.sec.route");
const reviewRouter = require("../secondary/review.sec.route");
const inquiryRouter = require("../secondary/inquiry.sec.route");
const userRouter = require("../secondary/user.sec.route");
const { checkAuthentication } = require("../../middlewares/checkAuthentication");
const { checkUserType, isAdmin } = require("../../middlewares/checkUserType");

const router = require("express")();

router.get("/", getMethodValidate(), validator, isAdmin,getrestaurants);
router.get("/:restaurantId", validate(["restaurantId"]), validator, getrestaurant);



router.post(
  "/",
  uploadImages({
    secondaryPath:"/homestay/restaurant",
    singleName:'coverImage'
  }),
  validate([
    "name",
    "parking",
    "noOfdishs",
    "locationId",
    "checkInTime",
    "checkOutTime",
    "email",
    "phoneNumber",
    "secondaryPhoneNumber",
    "coordinates"
  ]),
  validateArray(["dishs","dishpacks"]),
  validator,
  checkAuthentication(),
  checkUserType,
  isAdmin,
  postrestaurantController
);

router.patch(
  "/:restaurantId",
  validateOpt([
  "name",
  "parking",
  "noOfdishs",
  "locationId",
  "checkInTime",
  "checkOutTime",
  "email",
  "phoneNumber",
  "secondaryPhoneNumber"
]),
  validate([
    "restaurantId",
  ]),
  validator,
  patchrestaurantController
);

router.delete("/:restaurantId", validate(["restaurantId"]), validator, deleterestaurant);

router.use("/:restaurantId/dishpack", validate(["restaurantId"]), dishpackRouter);
router.use("/:restaurantId/dish", validate(["restaurantId"]), dishRouter);
router.use("/:restaurantId/review", validate(["restaurantId"]), reviewRouter);
router.use("/:restaurantId/user", validate(["restaurantId"]), userRouter);

module.exports = router;
 */