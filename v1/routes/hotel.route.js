const {
  getHotels,
  postHotelController,
  getHotel,
  deleteHotel,
  patchHotelController,
  patchHotelCoverImageController,
  patchHotelRelatedImagesController,
  putAllHotel,
  getHotelName,
} = require("../controllers/hotel.controller");

const { uploadImages } = require("../middlewares/multerfile");
const {
  validate,
  validateOpt,
  getMethodValidate,
  validateArray,
} = require("../middlewares/validate");
const { validator } = require("../middlewares/validator");

const packageRouter = require("./secondary/package.sec.route");
const roomRouter = require("./secondary/room.sec.route");
const reviewRouter = require("./secondary/review.sec.route");
const userRouter = require("./_user/user.sec.route");
const adminRouter = require("./admin/admin.sec.route");
const {  isAdmin } = require("../middlewares/checkUserType");
const { checkExistance } = require("../middlewares/checkExistance");
const RoomType = require("../../models/roomType.model");

const router = require("express")();

router.get(
  "/",
  getMethodValidate(),
  validateOpt(["locationId","rating","roomTypeId"]),
  validator,
  getHotels
);
router.get("/:hotelId", validate(["hotelId"]), validator, getHotel);
// router.get("/:hotelId/hotel-name", validate(["hotelId"]), validator, getHotelName);

router.post(
  "/",
  isAdmin(),
  uploadImages({
    secondaryPath: "/homestay/hotel",
    singleName: "coverImage",
  }),
  validate([
    "name",
    "parking",
    "noOfRooms",
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
  validateArray(["rooms", "packages"]),
  validator,
  postHotelController
);


module.exports = router;
