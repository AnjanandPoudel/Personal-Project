const mongoose = require("mongoose");
const { PARKING_OPTIONS, dishTYPE } = require("../utils/constants");
const Schema = mongoose.Schema;
const fuzzy = require("../utils/mongoose-fuzzy-search");


const dishTypeSchema = new Schema(
    {
        type:{
            type:String,
            enum:Object.values(dishTYPE),
            trim:true,
            index:true
           },
        name:{
            type:String,
            required:false,
        },
        description:{
            type:String,
            required:false
        },
       
    },
    { timestamps: true }
);



dishTypeSchema.plugin(fuzzy,{
    fields:{
      title_tg:"type"
    }
  }
  )
  
  dishTypeSchema.index({title_tg:1})

const dishType = mongoose.model("dishType", dishTypeSchema);
module.exports = dishType;