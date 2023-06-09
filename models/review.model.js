const mongoose = require("mongoose");
const fuzzy = require("../utils/mongoose-fuzzy-search");


const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    review: {
      type: String,
      required: true,
      trim: true,
    },
    rating:{
        type: Number,
        required: true,
        trim: true,
    },
    // image: {
    //   type: String,
    //   trim: true,
    // },
    // name: {
    //   type: String,
    //   trim: true,
    // },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true

    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"restaurant",
        index:true

    },
    approval:{
      type:Boolean,
      default:false,
      index:true

    }
    
    
  },
  { timestamps: true }
);




const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;


