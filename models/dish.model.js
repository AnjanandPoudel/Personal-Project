const mongoose = require("mongoose");
const { dish_SERVICES } = require("../utils/constants");
const Schema = mongoose.Schema;

const dishSchema = new Schema(
    {
        dishType:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'dishType',
            index:true

        },
        restaurant:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'restaurant',
            index:true

        },
        price:{
            type:Number,
            required:true,
            min: [0, 'Amount cannot be negative.'],

        },
        description:{
            type:String,
            required:false
        },
        count:{
            type:Number,
            required:false
        },
        services:{
            type:[String],
            enum:Object.values(dish_SERVICES),
            required:false
        }
       
    },
    { timestamps: true }
);

const dish = mongoose.model("dish", dishSchema);
module.exports = dish;