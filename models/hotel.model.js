const mongoose = require("mongoose");
const { PARKING_OPTIONS } = require("../utils/constants");
const fuzzy = require("../utils/mongoose-fuzzy-search");
const {
  RemoveAllPackagesFromHotel,
} = require("../utils/preMiddlewareFunctions/package");
const {
  RemoveAllRoomsFromHotel,
} = require("../utils/preMiddlewareFunctions/room");
const {
  RemoveAllReviewsFromHotel,
} = require("../utils/preMiddlewareFunctions/reviews");
const { deleteFile } = require("../utils/fileHandling");
const { SetErrorResponse } = require("../utils/responseSetter");

const Schema = mongoose.Schema;

const metaDataSchema = new Schema({
  _id: false,
  room: {
    price: {
      min: {
        type: Number,
        required: false,
      },
      max: {
        type: Number,
        required: false,
      },
      arr: {
        type: [Number],
        required: false,
      },
    },
    count: {
      type: Number,
      required: false,
    },
    capacity: {
      type: Number,
      required: false,
    },
    type: {
      type: [String],
      required: false,
    },
  },
  inquiry: {
    count: {
      total: {
        type: Number,
        required: false,
      },
      read: {
        type: Number,
        required: false,
      },
    },
    latest: {
      type: Date,
      required: false,
    },
  },
  review: {
    averageRating: {
      type: Number,
      required: false,
    },
    noOfRating: {
      type: Number,
      required: false,
    },
  },
});

const HotelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    breakfast: {
      type: Boolean,
      trim: true,
      default: false,
      index:true
    },
    parking: {
      type: String,
      enum: Object.values(PARKING_OPTIONS),
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    secondaryPhoneNumber: {
      type: String,
      required: false,
    },
    noOfRooms: {
      type: Number,
      required: false,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    coordinates: {
      type: [Number, "Coordinates values is not proper"],
      required: false,
    },
    checkInTime: {
      type: String,
      required: false,
    },
    checkOutTime: {
      type: String,
      required: false,
    },
    coverImage: {
      type: String,
      required: false,
    },
    relatedImages: {
      type: [String],
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    averageRating: {
      type: Number,
      required: false,
    },
    noOfRating: {
      type: Number,
      required: false,
    },
    totalInquiry: {
      type: Number,
      required: false,
    },
    meta: {
      type: metaDataSchema,
      select: false,
    },

    //just to do the work fast
    allRoomPrices: {
      type: [Number],
    },
    minRoomPrice: {
      type: Number,
    },
    maxRoomPrice: {
      type: Number,
    },
    //
    allRoomTypes: {
      type: [String],
    },
  },
  { timestamps: true }
);

HotelSchema.methods = {
  addAllRoomPrices(price) {
    this.allRoomPrices.push(price);
    this.minRoomPrice= Math.min(...this.allRoomPrices)
    this.maxRoomPrice= Math.max(...this.allRoomPrices)
  },
  editAllRoomPrices(price,old) {
    if (price) {
      this.allRoomPrices.splice(this.allRoomPrices.indexOf(old), 1);
      this.allRoomPrices.push(price);
      this.minRoomPrice= Math.min(...this.allRoomPrices)
      this.maxRoomPrice= Math.max(...this.allRoomPrices)

    }
  },
  deleteAllRoomPrices(old) {
    this.allRoomPrices.splice(this.allRoomPrices.indexOf(old), 1);
    this.minRoomPrice= Math.min(...this.allRoomPrices)
    this.maxRoomPrice= Math.max(...this.allRoomPrices)

  },

  addRoomTypes(type) {
    this.allRoomTypes.push(type);
  },
  editRoomTypes(type,old) {
    if (type) {
      this.allRoomTypes.splice(this.allRoomTypes.indexOf(old), 1);
      this.allRoomTypes.push(type);
    }
  },
  deleteRoomTypes(old) {
    this.allRoomTypes.splice(this.allRoomTypes.indexOf(old), 1);
  },


  increaseTotalInquiry() {
    this.totalInquiry++;
    // if (!this.meta)
    //   throw new SetErrorResponse("meta not found, Contact us", 500);
    // this.meta.inquiry.count.total++;
  },
  decreaseTotalInquiry() {
    this.totalInquiry--;
    // if (!this.meta)
    //   throw new SetErrorResponse("meta not found, Contact us", 500);
    // if (this.totalInquiry > 0) {
    //   this.meta.inquiry.count.total--;
    // }
  },

  increaseRoom(count) {
    this.noOfRooms += count;
    // if (!this.meta)
    //   throw new SetErrorResponse("meta not found, Contact us", 500);
    // if (this.meta) this.meta.room.count += count;
  },

  decreaseRoom(count) {
    this.noOfRooms -= count;
    // if (!this.meta)
    //   throw new SetErrorResponse("meta not found, Contact us", 500);
    // this.meta.room.count -= count;
  },
  updateRoomCount(count, oldCount) {
    this.noOfRooms += count - oldCount;
    // if (!this.meta)
    //   throw new SetErrorResponse("meta not found, Contact us", 500);
    // this.meta.room.count += count - oldCount;
  },

  // makeZero: function () {
  //   if (!this.meta)
  //     throw new SetErrorResponse("meta not found, Contact us", 500);
  //   this.meta.review.averageRating = 0;
  //   this.meta.review.noOfRating = 0;
  // },
  increment(rating) {
    this.averageRating =
      (this.averageRating * this.noOfRating + rating) / (this.noOfRating + 1);
    this.noOfRating += 1;
  },

  decrement(rating) {
    console.log({ av: this.averageRating, no: this.noOfRating, rating });

    if (this.averageRating > 0 && this.noOfRating > 1) {
      const totalNo = this.averageRating * this.noOfRating - rating;
      this.averageRating = totalNo / (this.noOfRating - 1);
      this.noOfRating -= 1;
    } else {
      this.averageRating = 0;
      this.noOfRating = 0;
    }
  },
  updateRating(newRating, oldRating) {
    if (this.averageRating && this.noOfRating) {
      const actualRating = newRating - oldRating;
      const totalNo = this.averageRating * this.noOfRating + actualRating;
      this.averageRating = totalNo / this.noOfRating;
    }
  },
};

HotelSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      console.log(this);
      await Promise.all([
        RemoveAllRoomsFromHotel(this?._id),
        RemoveAllPackagesFromHotel(this?._id),
        RemoveAllReviewsFromHotel(this?._id),
      ]);
      next();
    } catch (error) {
      throw error;
    }
  }
);

HotelSchema.plugin(fuzzy, {
  fields: {
    name_tg: "name",
  },
});

HotelSchema.index({ name_tg: 1 });

const Hotel = mongoose.model("Hotel", HotelSchema);
// Hotel.createCollection('hotelInquiryView',{
//   // viewOn:'existingCollecti'
//   pipeline:[
//     {
//       $group: {
//         _id: "$email",
//         email:{ $first: "$email" },
//         name:{ $first: "$name" },
//         hotelId: { $first: "$hotel" },
//         createdAt: {
//           $push: "$createdAt",
//         },
//       },
//     },
//     { $sort: { createdAt: -1 } },
//     {
//       $lookup: {
//         from: "inquiries",
//         localField: "email",
//         foreignField: "email",
//         as: "inquiry_doc",
//         pipeline: [{ $match: {hotel:hotelId} }],

//       },
//     },

//   ]
// })

module.exports = Hotel;
