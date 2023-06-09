const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fuzzy = require("../utils/mongoose-fuzzy-search");


const LocationSchema = new Schema(
    {
    name:{
        type:String,
        required:true,
        index:true
    },
    type:{
        type:String,
        enum:['Point'],
        required:true
       },
    coordinates:{
        type:[Number],
        required:false,
    },
    coverImage:{
        type:String,
        required:false
    },
    description:{
      type:String,
      required:false
    }
},
{ timestamps: true }
);

// {
//     type:{
//         type:String,
//         enum:['Polygon'],
//         required:true
//        },
//     coordinates:{
//         type:[[[Number]]],
//         required:false,

//     }
// },
// { timestamps: true }



LocationSchema.plugin(fuzzy,{
    fields:{
      title_tg:"name"
    }
  }
  )
  
  LocationSchema.index({title_tg:1})

const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;