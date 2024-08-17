const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require("joi");

const listingSchema = new Schema({
    title:  {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    image:{
        url: String,
        filename: String,
        // default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcityfurnish.com%2Fblog%2Ftop-10-beaches-in-india&psig=AOvVaw35wMTByLJEuBE3_Od-BkUk&ust=1723395762150000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLDWidjz6ocDFQAAAAAdAAAAABAE",
        // set: (v) => v === "" 
        // ? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcityfurnish.com%2Fblog%2Ftop-10-beaches-in-india&psig=AOvVaw35wMTByLJEuBE3_Od-BkUk&ust=1723395762150000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLDWidjz6ocDFQAAAAAdAAAAABAE" 
        // : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type : Schema.Types.ObjectId,
        ref: "User",
    },
    // category: {
    //     type:String,
    //     enum: ["mountains", "arctic", "farms", ""]
    // }
});

listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
    

} )

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 