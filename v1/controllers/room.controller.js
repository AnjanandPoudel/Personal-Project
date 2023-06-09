const RoomType = require("../../models/roomType.model");
const Room = require("../../models/room.model");
const { SetErrorResponse } = require("../../utils/responseSetter");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");

//? may not need this cause it is already present in hotel controller
exports.getRoomTypes = async (req, res) => {
  try {
    const { page, limit, search, sort } = req.query;
    const rooms = await getFuzzySearchPaginatedData(
      RoomType,
      {
        query: {},
        sort,
        page,
        limit,
        pagination: true,
        modFunction: (document) => {
          return document;
        },
      },
      search
    );
    if (rooms?.length < 1) throw new SetErrorResponse();

    return res.success(rooms);
  } catch (error) {
    res.fail(error);
  }
};

exports.getRoomType = async (req, res) => {
  try {
    const { roomTypeId } = req.params;
    const data = await RoomType.findOne({ _id: roomTypeId });
    if (!data) throw new SetErrorResponse();
    return res.success({ data });
  } catch (error) {
    res.fail(error);
  }
};

exports.postRoomType = async (req, res) => {
  try {
    const { type, description, name } = req.body;
    const room = await new RoomType({
      name,
      type,
      description,
    }).save();

    if (!room) throw new SetErrorResponse("Error Creating", 403);
    return res.success({}, "Room Created ");
  } catch (error) {
    res.fail(error);
  }
};

exports.patchRoomType = async (req, res) => {
  try {
    const roomTypeId = req.params.roomTypeId;
    const { type, description, name } = req.body;

    const room = await RoomType.findByIdAndUpdate(
      { _id: roomTypeId },
      { name, type, description }
    );
    if (!room) throw new SetErrorResponse("Room Not Found");
    return res.success({}, "Room Updated ");
  } catch (error) {
    req.file(error);
  }
};

exports.deleteRoomType = async (req, res) => {
  try {
    const { roomTypeId } = req.params;
    const room = await RoomType.findByIdAndDelete(roomTypeId).lean();
    if (!room) throw new SetErrorResponse();

    return res.success({}, "Package Deleted ! ");
  } catch (error) {
    res.fail(error);
  }
};

//* Following code is for Hotel + Rooms

exports.getHotelRoom = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    const data = await Room.find({ hotel: hotelId, roomId }).lean();

    if (!data) throw new SetErrorResponse();
    return res.success(data);
  } catch (error) {
    res.fail(error);
  }
};
exports.getHotelRooms = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const rooms = await Room.find({ hotel: hotelId }).lean();

    if (rooms?.length < 1) throw new SetErrorResponse("Rooms Not Found");
    return res.success(rooms);
  } catch (error) {
    res.fail(error);
  }
};

exports.postHotelRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { roomTypeId, price, description, count, services } = req.body;
    
    const room = await new Room({
      hotel: hotelId,
      roomType: roomTypeId,
      price,
      description,
      count,
      services,
    })
    
    room.save()
    if (!room) throw new SetErrorResponse("Error Creating Room",500);

    const hotel=req?.existedDoc
    if(!hotel) throw new SetErrorResponse("If you see this please contact us!",500)

    const roomType= req?.roomType
    if(!roomType) throw new SetErrorResponse("If you see this please contact us!",500)

    // hotel.increaseRoom(count)
    // hotel.pushRoomPrice(price)
    // hotel.pushRoomType(roomTypeId)
    hotel.addAllRoomPrices(price)
    hotel.addRoomTypes(roomType.type)
    hotel.save()



    return res.success({room}, "Room Created !!");
  } catch (error) {
    res.fail(error);
  }
};



exports.patchHotelRoom = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    const { roomTypeId, price, description, count, services } = req.body;
    const room = await Room.findOneAndUpdate(
      {
        room: roomId,
        hotel: hotelId,
      },
      {
        roomType: roomTypeId,
        price,
        description,
        count,
        services,
      }
    ).lean();

    if (!room) throw new SetErrorResponse("Room Not Found");
    const hotel=req?.existedDoc
    if(!hotel) throw new SetErrorResponse("If you see this please contact us!",500)
    const roomType= req?.roomType
    if(!roomType  ) throw new SetErrorResponse("If you see this please contact us!",500)
    
    const oldRoomType=RoomType.findById(room?.roomType,"type").lean()
    
    hotel.updateRoomCount(count,room.count)
    // hotel.updateRoomPrice(price,room.price)
    // hotel.updateRoomType(roomTypeId,room.roomTypeId)
    hotel.editAllRoomPrices(price,room.price)
    hotel.editRoomTypes(roomType.type,oldRoomType.type)
    hotel.save()

    return res.success({}, "Room Updated !!");
  } catch (error) {
    res.fail(error);
  }
};


exports.RemoveRoomFromHotel = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    const room = await Room.findOneAndDelete({
      hotel: hotelId,
      room: roomId,
    }).lean();

    if (!room) throw new SetErrorResponse();
    const hotel=req?.existedDoc
    if(!hotel) throw new SetErrorResponse("If you see this please contact us!",500)
    const roomType= req?.roomType
    if(!roomType  ) throw new SetErrorResponse("If you see this please contact us!",500)


    hotel.increaseRoom(room.count)
    // hotel.popRoomPrice(room.price)
    // hotel.popRoomType(room.roomTypeId)
    hotel.deleteAllRoomPrices(room.price)
    hotel.deleteRoomTypes(roomType.type)
    hotel.save()

    return res.success({}, "Deleted");
  } catch (error) {
    res.fail(error);
  }
};
