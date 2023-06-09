const router = require("express").Router({ mergeParams: true });
const Hotel = require("../../../models/hotel.model");
const RoomType = require("../../../models/roomType.model");
const {
  getHotelRooms,
  getRoom,
  RemoveRoomFromHotel,
  getRoomType,
  patchHotelRoom,
  getHotelRoom,
  postHotelRoom,
} = require("../../controllers/room.controller");
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
router.get("/", getMethodValidate(), validator, getHotelRooms);
router.get("/:roomId", validate(["roomId"]), validator, getHotelRoom);

router.post(
  "/",
  validate(["roomTypeId", "hotelId", "price", "description", "count"]),
  validateArray(["services"]),
  checkExistance(RoomType, [{
    key:"_id",
    value:"body.roomTypeId"
  }],"roomType"),
  checkExistance(Hotel, [{
    key:"_id",
    value:"params.hotelId"
  }],"hotel"),
  validator,
  postHotelRoom
);

router.patch(
  "/:roomId",
  validate(["roomId", "roomTypeId", "hotelId"]),
  validateOpt(["price", "description", "count"]),
  checkExistance(RoomType, [{
    key:"_id",
    value:"body.roomTypeId"
  }]),
  checkExistance(Hotel, [{
    key:"_id",
    value:"params.hotelId"
  }]),
  
  validator,
  patchHotelRoom
);

router.delete(
  "/:roomId",
  validate(["roomId"]),
  validator,
  checkExistance(Hotel, [{
    key:"_id",
    value:"params.hotelId"
  }]),
  isAdmin(),
  RemoveRoomFromHotel
);

module.exports = router;
