const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
