const e = require("express");
const restaurant = require("../../models/restaurant.model");
const Inquiry = require("../../models/inquiry.model");
const Location = require("../../models/location.model");
const dishpack = require("../../models/dishpack");
const dishpackrestaurantRel = require("../../models/dishpackrestaurantRel");
const Review = require("../../models/review.model");
const dish = require("../../models/dish.model");
const dishType = require("../../models/dishType.model");
const { deleteFile } = require("../../utils/fileHandling");
const { SetErrorResponse } = require("../../utils/responseSetter");
const { getFuzzySearchPaginatedData } = require("../utils/pagination");



exports.getrestaurants = async (req, res, next) => {
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
      dishType,
    } = req.query;
    let inquirySelect = null;
    let query = {};
    let dishTypeArr;

    if (locationId) {
      query.location = locationId;
    }
    if (rating) {
      query.averageRating = { $gte: rating };
    }
    if (dishType) {
      dishTypeArr=dishType.split('-')
      query.alldishTypes={$in:dishTypeArr}
    }
    if (inquiry || inquiryBool ) {
      inquirySelect = "name email createdAt phoneNumber ";
    }


    let restaurants = await getFuzzySearchPaginatedData(
      restaurant,
      {
        query: query,
        sort,
        limit,
        page,
        populate: { path: "location", select: "name  coordinates " },
        lean: true,
        pagination: true,
        modFunction: async (document) => {
          const dish = await dish.find({ restaurant: document?._id }).select(
            "count price"
          );
          let count = 0;
          let prices = [];
          dish.forEach((item) => {
            count = parseInt(item.count) + count;
            prices.push(item?.price);
          });
          document.totaldish = count;
          document.startingPrice = Math.min(...prices);


          const location = await Location.findOne({ _id: document?.location }).select(
            "name coordinates "
          ).lean()
          document.location=location

          if(dishType){
            let notSending=true
            let dishTypeArr=[]
            dishTypeArr=dishType.split('_')
            console.log(typeof dishTypeArr)

            dishTypeArr?.forEach(item=>{
              document?.alldishTypes?.forEach(element=>{
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
        "-noOfdishs "
        )
    );

    if (inquiry) {
      restaurants = await restaurant.aggregate([
        { $sort: { createdAt: -1 } },

        {
          $lookup: {
            from: "inquiries",
            localField: "_id",
            foreignField: "restaurant",
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
      restaurants.forEach((restaurant) => {
        restaurant.markAsRead = restaurant?.markAsRead?.every((data) => data);
      });
      
    }

    if (false) {
      restaurants = await Inquiry.aggregate([
        
        {
          $lookup: {
            from: "restaurants",
            localField: "restaurant",
            foreignField: "_id",
            as: "restaurant",
          },
        },
        { $unwind: "$restaurant" },
        // { $sort: { "inquiry_doc.createdAt": -1 } },
        
        {
          $group: {
            _id: "$restaurant._id",
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
      res.success({results:restaurants});
    }
    else{
      res.success(restaurants);

    }
    
  } catch (error) {
    res.fail(error);
  }
};



exports.postrestaurantController = async (req, res, next) => {
  try {
    const {
      name,
      breakfast,
      parking,
      noOfdishs,
      checkInTime,
      locationId,
      latitude,
      longitude,
      checkOutTime,
      email,
      phoneNumber,
      secondaryPhoneNumber,
      dishs,
      dishpacks,
      description,
    } = req.body;



    const coordinatesJson = [latitude, longitude];

    //this may be in the validate middleware
    const isLocation = await Location.findById(
      { _id: locationId },
      "_id"
    ).lean();
    if (!isLocation) throw new SetErrorResponse("Location Not Found", 400);

    const restaurant = new restaurant({
      name,
      breakfast,
      parking,
      noOfdishs,
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

    //dish
    await Promise.all([restaurant.save(), dishpack, dish].flat(2));

    restaurant.save()    

    if (!restaurant) throw new SetErrorResponse("restaurant not Created", 400);
    return res.success(restaurant, "restaurant Created ");
  } catch (error) {
    res.fail(error);
  }
};

exports.deleterestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await restaurant.findOne({ _id: restaurantId });

    if (!restaurant) throw new SetErrorResponse();
    await restaurant.deleteOne();
    if (restaurant?.relatedImages) {
      for (let i = 0; i < restaurant?.relatedImages?.length; i++) {
        deleteFile(restaurant?.relatedImages[i]);
      }
    }
    if (restaurant?.coverImage) {
      deleteFile(restaurant?.coverImage);
    }

    return res.success({}, "restaurant Deleted ");
  } catch (error) {
    res.fail(error);
  }
};
