const mongoose = require("mongoose");

const biddingSchema = mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bidAmount: {
    type: Number,
    required: true,
  },
});

const Bidding = mongoose.model("Bidding", biddingSchema);
module.exports = Bidding;
