const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected successfully")
}).catch((err) => {
    console.log(err.message);
})

async function main() {
    await mongoose.connect(MONGO_URL);
  }

  const initDB = async () => {
    try {
      await Listing.deleteMany({});
      initData.data= initData.data.map((obj) =>({...obj, owner:"66be447f2cbe29cafb643be3"})); //ye naya arrayy create krta hai
      await Listing.insertMany(initData.data);
      console.log('Data was initialized');
    } catch (err) {
      console.error('Error initializing data:', err);
    }
  };
  
  initDB();