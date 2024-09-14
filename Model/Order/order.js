const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  paymentDetails: { type: Object },
});

const Orders = mongoose.model("Orders", orderSchema);
module.exports = Orders;
