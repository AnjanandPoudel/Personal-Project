const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    const url = process.env.MONGO_URI_ONLINE;
    const db = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });
    if (db) {
      console.log(
        "Connected to database with host:" +
          `${db?.connection?.host} and name: ${db?.connection?.name}`
      );
    }
  } catch (err) {
    console.log(err);
  }
};