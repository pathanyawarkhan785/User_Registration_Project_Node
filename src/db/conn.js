const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/registerationdb");
    console.log("connection successful.");
  } catch (e) {
    console.log(e);
  }
};

connect();
