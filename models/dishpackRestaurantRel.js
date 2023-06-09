const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dishpackrestaurantRelSchema = new Schema(
    {
        dishpack:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'dishpack',
            index:true
        },
        restaurant:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'restaurant',
            index:true

        }
    },
    { timestamps: true }
);

const dishpackrestaurantRel = mongoose.model("dishpackrestaurantRel", dishpackrestaurantRelSchema);
module.exports = dishpackrestaurantRel;