const mongoose = require("mongoose");
const { PARKING_OPTIONS, dishTYPE } = require("../utils/constants");
const Schema = mongoose.Schema;
const fuzzy = require("../utils/mongoose-fuzzy-search");


const dishpackSchema = new Schema(
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


dishpackSchema.plugin(fuzzy,{
    fields:{
      title_tg:"name"
    }
  }
  )
  
  dishpackSchema.index({title_tg:1})

const dishpack = mongoose.model("dishpack", dishpackSchema);
module.exports = dishpack;