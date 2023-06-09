const mongoose = require("mongoose");
const { PARKING_OPTIONS, ROOMTYPE } = require("../utils/constants");
const Schema = mongoose.Schema;
const fuzzy = require("../utils/mongoose-fuzzy-search");


const RoomTypeSchema = new Schema(
    {
        type:{
            type:String,
            enum:Object.values(ROOMTYPE),
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



RoomTypeSchema.plugin(fuzzy,{
    fields:{
      title_tg:"type"
    }
  }
  )
  
  RoomTypeSchema.index({title_tg:1})

const RoomType = mongoose.model("RoomType", RoomTypeSchema);
module.exports = RoomType;