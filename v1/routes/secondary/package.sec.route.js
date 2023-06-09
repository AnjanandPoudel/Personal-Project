const {
  validate,
  validateOpt,
  getMethodValidate,
} = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

const express = require("express");
const {
  getdishpack,
  getrestaurantdishpacks,
  RemovedishpackFromrestaurant,
} = require("../../controllers/dishpack.controller");
const {  isAdmin } = require("../../middlewares/checkUserType");

const router = express.Router({ mergeParams: true });

router.get("/", getMethodValidate(), validator, getrestaurantdishpacks);
router.get("/:dishpackId", validate(["dishpackId"]), validator, getdishpack);

// router.post('/',validate(["name","description","price"]) , validator , getrestaurantdishpacks)

router.delete(
  "/:dishpackId",
  validate(["dishpackId"]),
  validator,
  isAdmin(),
  RemovedishpackFromrestaurant
);

module.exports = router;
