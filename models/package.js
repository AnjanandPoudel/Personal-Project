const mongoose = require("mongoose");
const { PARKING_OPTIONS, ROOMTYPE } = require("../utils/constants");
const Schema = mongoose.Schema;
const fuzzy = require("../utils/mongoose-fuzzy-search");


const PackageSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:false
        },
        price:{
            type:Number,
            required:true
        }
    },
    { timestamps: true }
);


PackageSchema.plugin(fuzzy,{
    fields:{
      title_tg:"name"
    }
  }
  )
  
  PackageSchema.index({title_tg:1})

const Package = mongoose.model("Package", PackageSchema);
module.exports = Package;