const e = require("express");
const Hotel = require("../../models/hotel.model");
const Inquiry = require("../../models/inquiry.model");
const Location = require("../../models/location.model");
const Package = require("../../models/package");
const PackageHotelRel = require("../../models/packageHotelRel");
const Review = require("../../models/review.model");
const Room = require("../../models/room.model");
const RoomType = require("../../models/roomType.model");
const { deleteFile } = require("../../utils/fileHandling");
const { SetErrorResponse } = require("../../utils/responseSetter");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");



exports.getHotels = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      search,
      sort,
      inquiry = false,
      inquiryBool=false,
      querySelect,
      locationId,
      rating,
      roomType,
    } = req.query;
    let inquirySelect = null;
    let query = {};
    let roomTypeArr;

    if (locationId) {
      query.location = locationId;
    }
    if (rating) {
      query.averageRating = { $gte: rating };
    }
    if (roomType) {
      roomTypeArr=roomType.split('-')
      query.allRoomTypes={$in:roomTypeArr}
    }
    if (inquiry || inquiryBool ) {
      inquirySelect = "name email createdAt phoneNumber ";
    }


    let hotels = await getFuzzySearchPaginatedData(
      Hotel,
      {
        query: query,
        sort,
        limit,
        page,
        populate: { path: "location", select: "name  coordinates " },
        lean: true,
        pagination: true,
        modFunction: async (document) => {
          const room = await Room.find({ hotel: document?._id }).select(
            "count price"
          );
          let count = 0;
          let prices = [];
          room.forEach((item) => {
            count = parseInt(item.count) + count;
            prices.push(item?.price);
          });
          document.totalRoom = count;
          document.startingPrice = Math.min(...prices);


          const location = await Location.findOne({ _id: document?.location }).select(
            "name coordinates "
          ).lean()
          document.location=location

          if(roomType){
            let notSending=true
            let roomTypeArr=[]
            roomTypeArr=roomType.split('_')
            console.log(typeof roomTypeArr)

            roomTypeArr?.forEach(item=>{
              document?.allRoomTypes?.forEach(element=>{
                console.log(document)
                if(item==element){
                  notSending=false
                }
              })
            })
            document.notSending=notSending
          }


          if(locationId && locationId!=location?._id){
             document.notSending=true
          }
          if(rating && document.averageRating<rating){
            document.notSending=true
          }

          return document;
        },
      },
      search,
      (select =
        querySelect ||
        inquirySelect ||
        "-noOfRooms "
        )
    );

    if (inquiry) {
      hotels = await Hotel.aggregate([
        { $sort: { createdAt: -1 } },

        {
          $lookup: {
            from: "inquiries",
            localField: "_id",
            foreignField: "hotel",
            as: "inquiry_doc",
            pipeline: [],
          },
        },
        { $unwind: "$inquiry_doc" },
        { $sort: { "inquiry_doc.createdAt": -1 } },

        {
          $group: {
            _id: "$_id",
            email: { $first: "$email" },
            name: { $first: "$name" },
            phoneNumber:{ $first: "$phoneNumber"},
            createdAt: { $push: "$inquiry_doc.createdAt" },
            markAsRead: { $push: "$inquiry_doc.markAsRead" },
          },
        },
        {
          $project: {
            email: 1,
            name: 1,
            phoneNumber:1,
            createdAt: { $arrayElemAt: ["$createdAt", 0] },
            totalInquiry: {
              $cond: {
                if: { $isArray: "$createdAt" },
                then: { $size: "$createdAt" },
                else: null,
              },
            },
            markAsRead: "$markAsRead" ,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      hotels.forEach((hotel) => {
        hotel.markAsRead = hotel?.markAsRead?.every((data) => data);
      });
      
    }

    if (false) {
      hotels = await Inquiry.aggregate([
        
        {
          $lookup: {
            from: "hotels",
            localField: "hotel",
            foreignField: "_id",
            as: "hotel",
          },
        },
        { $unwind: "$hotel" },
        // { $sort: { "inquiry_doc.createdAt": -1 } },
        
        {
          $group: {
            _id: "$hotel._id",
            email: { $first: "$email" },
            name: { $first: "$name" },
            createdAt: { $max: "$createdAt" },
            markAsRead: { $min: "$markAsRead" },
            // markArr:{$push:"$markAsRead"}
          },
        },
        
        { $sort: { markAsRead:1,createdAt:-1  } },
        
      ]);
     
    }

    if(inquiry){
      res.success({results:hotels});
    }
    else{
      res.success(hotels);

    }
    
  } catch (error) {
    res.fail(error);
  }
};



exports.postHotelController = async (req, res, next) => {
  try {
    const {
      name,
      breakfast,
      parking,
      noOfRooms,
      checkInTime,
      locationId,
      latitude,
      longitude,
      checkOutTime,
      email,
      phoneNumber,
      secondaryPhoneNumber,
      rooms,
      packages,
      description,
    } = req.body;



    const coordinatesJson = [latitude, longitude];

    //this may be in the validate middleware
    const isLocation = await Location.findById(
      { _id: locationId },
      "_id"
    ).lean();
    if (!isLocation) throw new SetErrorResponse("Location Not Found", 400);

    const hotel = new Hotel({
      name,
      breakfast,
      parking,
      noOfRooms,
      location: locationId,
      coordinates: coordinatesJson,
      checkInTime,
      checkOutTime,
      email,
      phoneNumber,
      secondaryPhoneNumber,
      description,
      averageRating: 0,
      noOfRating: 0,
    });

    // Images
    // CANT DISPLAY

    //Room
    await Promise.all([hotel.save(), package, room].flat(2));

    hotel.save()    

    if (!hotel) throw new SetErrorResponse("Hotel not Created", 400);
    return res.success(hotel, "Hotel Created ");
  } catch (error) {
    res.fail(error);
  }
};

exports.deleteHotel = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findOne({ _id: hotelId });

    if (!hotel) throw new SetErrorResponse();
    await hotel.deleteOne();
    if (hotel?.relatedImages) {
      for (let i = 0; i < hotel?.relatedImages?.length; i++) {
        deleteFile(hotel?.relatedImages[i]);
      }
    }
    if (hotel?.coverImage) {
      deleteFile(hotel?.coverImage);
    }

    return res.success({}, "Hotel Deleted ");
  } catch (error) {
    res.fail(error);
  }
};
