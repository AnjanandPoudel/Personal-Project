const {
  validate,
  validateOpt,
  getMethodValidate,
} = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

const express = require("express");
const {
  getPackage,
  getHotelPackages,
  RemovePackageFromHotel,
} = require("../../controllers/package.controller");
const {  isAdmin } = require("../../middlewares/checkUserType");

const router = express.Router({ mergeParams: true });

router.get("/", getMethodValidate(), validator, getHotelPackages);
router.get("/:packageId", validate(["packageId"]), validator, getPackage);

// router.post('/',validate(["name","description","price"]) , validator , getHotelPackages)

router.delete(
  "/:packageId",
  validate(["packageId"]),
  validator,
  isAdmin(),
  RemovePackageFromHotel
);

module.exports = router;
