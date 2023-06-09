const router = require("express").Router({ mergeParams: true });
const { check } = require("express-validator");

//routers
const restaurantRouter= require('./secondary/restaurant.sec.route')

//controllers
const {
  getLocations,
  getLocation,
  postLocationController,
  deleteLocationController,
  patchLocationController,
} = require("../controllers/location.controller");


//validators
const { uploadImages } = require("../middlewares/multerfile");
const { validate, getMethodValidate, validateOpt } = require("../middlewares/validate");
const { validator } = require("../middlewares/validator");
const { isAdmin } = require("../middlewares/checkUserType");


const validType = (value) => {
  return [
    check(value, `${value} is not Valid`)
      .optional()
      .custom((data) => {
        return data === "Point";
      }),
  ];
};


//API
router.get("/", getMethodValidate(), validator, getLocations);
router.get("/:locationId", validate(["locationId"]), validator, getLocation);

router.post(
  "/",
  isAdmin(),
  uploadImages({
    secondaryPath:"/homestay/restaurant",
    singleName:"coverImage"
  }),
  validType("type"),
  validate(["name", "coordinates"]),
  validator,
  postLocationController
);

router.patch(
  "/:locationId",
  isAdmin(),
  uploadImages({
    secondaryPath:"/homestay/restaurant",
    singleName:"coverImage"
  }),
  validType("type"),
  validateOpt(["name", "coordinates","locationId"]),
  validator,

  patchLocationController
);

router.delete(
  "/:locationId",
  isAdmin(),
  validate(["locationId"]),
  validator,
  deleteLocationController
);

//!use

router.use('/:locationId/restaurant',restaurantRouter)

module.exports = router;
