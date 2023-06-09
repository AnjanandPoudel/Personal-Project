/* const {
  getHotels,
  postHotelController,
  getHotel,
  deleteHotel,
  patchHotelController,
  
} = require("../../controllers/hotel.controller");



const { uploadImages } = require("../../middlewares/multerfile");
const { validate, validateOpt, getMethodValidate, validateArray } = require("../../middlewares/validate");
const { validator } = require("../../middlewares/validator");

const packageRouter = require("../secondary/package.sec.route");
const roomRouter = require("../secondary/room.sec.route");
const reviewRouter = require("../secondary/review.sec.route");
const inquiryRouter = require("../secondary/inquiry.sec.route");
const userRouter = require("../secondary/user.sec.route");
const { checkAuthentication } = require("../../middlewares/checkAuthentication");
const { checkUserType, isAdmin } = require("../../middlewares/checkUserType");

const router = require("express")();

router.get("/", getMethodValidate(), validator, isAdmin,getHotels);
router.get("/:hotelId", validate(["hotelId"]), validator, getHotel);



router.post(
  "/",
  uploadImages({
    secondaryPath:"/homestay/hotel",
    singleName:'coverImage'
  }),
  validate([
    "name",
    "parking",
    "noOfRooms",
    "locationId",
    "checkInTime",
    "checkOutTime",
    "email",
    "phoneNumber",
    "secondaryPhoneNumber",
    "coordinates"
  ]),
  validateArray(["rooms","packages"]),
  validator,
  checkAuthentication(),
  checkUserType,
  isAdmin,
  postHotelController
);

router.patch(
  "/:hotelId",
  validateOpt([
  "name",
  "parking",
  "noOfRooms",
  "locationId",
  "checkInTime",
  "checkOutTime",
  "email",
  "phoneNumber",
  "secondaryPhoneNumber"
]),
  validate([
    "hotelId",
  ]),
  validator,
  patchHotelController
);

router.delete("/:hotelId", validate(["hotelId"]), validator, deleteHotel);

router.use("/:hotelId/package", validate(["hotelId"]), packageRouter);
router.use("/:hotelId/room", validate(["hotelId"]), roomRouter);
router.use("/:hotelId/review", validate(["hotelId"]), reviewRouter);
router.use("/:hotelId/user", validate(["hotelId"]), userRouter);

module.exports = router;
 */