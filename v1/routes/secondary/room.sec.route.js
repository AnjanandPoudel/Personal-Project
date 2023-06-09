const router = require("express").Router({ mergeParams: true });
const restaurant = require("../../../models/restaurant.model");
const dishType = require("../../../models/dishType.model");
const {
  getrestaurantdishs,
  getdish,
  RemovedishFromrestaurant,
  getdishType,
  patchrestaurantdish,
  getrestaurantdish,
  postrestaurantdish,
} = require("../../controllers/dish.controller");
const { checkExistance } = require("../../middlewares/checkExistance");

//middlewares
const { isAdmin } = require("../../middlewares/checkUserType");
const {
  validate,
  validateOpt,
  getMethodValidate,
  validateArray,
} = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

//Routes
router.get("/", getMethodValidate(), validator, getrestaurantdishs);
router.get("/:dishId", validate(["dishId"]), validator, getrestaurantdish);

router.post(
  "/",
  validate(["dishTypeId", "restaurantId", "price", "description", "count"]),
  validateArray(["services"]),
  checkExistance(dishType, [{
    key:"_id",
    value:"body.dishTypeId"
  }],"dishType"),
  checkExistance(restaurant, [{
    key:"_id",
    value:"params.restaurantId"
  }],"restaurant"),
  validator,
  postrestaurantdish
);

router.patch(
  "/:dishId",
  validate(["dishId", "dishTypeId", "restaurantId"]),
  validateOpt(["price", "description", "count"]),
  checkExistance(dishType, [{
    key:"_id",
    value:"body.dishTypeId"
  }]),
  checkExistance(restaurant, [{
    key:"_id",
    value:"params.restaurantId"
  }]),
  
  validator,
  patchrestaurantdish
);

router.delete(
  "/:dishId",
  validate(["dishId"]),
  validator,
  checkExistance(restaurant, [{
    key:"_id",
    value:"params.restaurantId"
  }]),
  isAdmin(),
  RemovedishFromrestaurant
);

module.exports = router;
