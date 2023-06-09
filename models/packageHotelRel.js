const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PackageHotelRelSchema = new Schema(
    {
        package:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Package',
            index:true
        },
        hotel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Hotel',
            index:true

        }
    },
    { timestamps: true }
);

const PackageHotelRel = mongoose.model("PackageHotelRel", PackageHotelRelSchema);
module.exports = PackageHotelRel;