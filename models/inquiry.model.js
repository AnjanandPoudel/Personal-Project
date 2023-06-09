const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fuzzy = require("../utils/mongoose-fuzzy-search");


const InquirySchema = new Schema(
    {
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'restaurant',
        index:true
    },
    // other things are deleted
},
{ timestamps: true }
);


const Inquiry = mongoose.model("Inquiry", InquirySchema);
module.exports = Inquiry;