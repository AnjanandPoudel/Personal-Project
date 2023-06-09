const mongoose = require("mongoose");
const { PARKING_OPTIONS } = require("../utils/constants");
const fuzzy = require("../utils/mongoose-fuzzy-search");
const {
  RemoveAlldishpacksFromrestaurant,
} = require("../utils/preMiddlewareFunctions/dishpack");
const {
  RemoveAlldishsFromrestaurant,
} = require("../utils/preMiddlewareFunctions/dish");
const {
  RemoveAllReviewsFromrestaurant,
} = require("../utils/preMiddlewareFunctions/reviews");
const { deleteFile } = require("../utils/fileHandling");
const { SetErrorResponse } = require("../utils/responseSetter");

const Schema = mongoose.Schema;

const metaDataSchema = new Schema({
  _id: false,
  dish: {
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

const restaurantSchema = new Schema(
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
    noOfdishs: {
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
    alldishPrices: {
      type: [Number],
    },
    mindishPrice: {
      type: Number,
    },
    maxdishPrice: {
      type: Number,
    },
    //
    alldishTypes: {
      type: [String],
    },
  },
  { timestamps: true }
);

restaurantSchema.methods = {
  addAlldishPrices(price) {
    this.alldishPrices.push(price);
    this.mindishPrice= Math.min(...this.alldishPrices)
    this.maxdishPrice= Math.max(...this.alldishPrices)
  },
  editAlldishPrices(price,old) {
    if (price) {
      this.alldishPrices.splice(this.alldishPrices.indexOf(old), 1);
      this.alldishPrices.push(price);
      this.mindishPrice= Math.min(...this.alldishPrices)
      this.maxdishPrice= Math.max(...this.alldishPrices)

    }
  },
  deleteAlldishPrices(old) {
    this.alldishPrices.splice(this.alldishPrices.indexOf(old), 1);
    this.mindishPrice= Math.min(...this.alldishPrices)
    this.maxdishPrice= Math.max(...this.alldishPrices)

  },

  adddishTypes(type) {
    this.alldishTypes.push(type);
  },
  editdishTypes(type,old) {
    if (type) {
      this.alldishTypes.splice(this.alldishTypes.indexOf(old), 1);
      this.alldishTypes.push(type);
    }
  },
  deletedishTypes(old) {
    this.alldishTypes.splice(this.alldishTypes.indexOf(old), 1);
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

  increasedish(count) {
    this.noOfdishs += count;
    // if (!this.meta)
    //   throw new SetErrorResponse("meta not found, Contact us", 500);
    // if (this.meta) this.meta.dish.count += count;
  },

  decreasedish(count) {
    this.noOfdishs -= count;
    // if (!this.meta)
    //   throw new SetErrorResponse("meta not found, Contact us", 500);
    // this.meta.dish.count -= count;
  },
  updatedishCount(count, oldCount) {
    this.noOfdishs += count - oldCount;
    // if (!this.meta)
    //   throw new SetErrorResponse("meta not found, Contact us", 500);
    // this.meta.dish.count += count - oldCount;
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

restaurantSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      console.log(this);
      await Promise.all([
        RemoveAlldishsFromrestaurant(this?._id),
        RemoveAlldishpacksFromrestaurant(this?._id),
        RemoveAllReviewsFromrestaurant(this?._id),
      ]);
      next();
    } catch (error) {
      throw error;
    }
  }
);

restaurantSchema.plugin(fuzzy, {
  fields: {
    name_tg: "name",
  },
});

restaurantSchema.index({ name_tg: 1 });

const restaurant = mongoose.model("restaurant", restaurantSchema);
// restaurant.createCollection('restaurantInquiryView',{
//   // viewOn:'existingCollecti'
//   pipeline:[
//     {
//       $group: {
//         _id: "$email",
//         email:{ $first: "$email" },
//         name:{ $first: "$name" },
//         restaurantId: { $first: "$restaurant" },
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
//         pipeline: [{ $match: {restaurant:restaurantId} }],

//       },
//     },

//   ]
// })

module.exports = restaurant;
