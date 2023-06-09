const mongoose = require("mongoose");
const { ROOM_SERVICES } = require("../utils/constants");
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
    {
        roomType:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'RoomType',
            index:true

        },
        hotel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Hotel',
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
            enum:Object.values(ROOM_SERVICES),
            required:false
        }
       
    },
    { timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;