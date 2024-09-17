const express = require("express");
const router = express.Router();
const Orders = require("../../Model/Order/order");
const validateToken = require("../../Middleware/auth-middleware").validateToken;
const mongoose = require("mongoose");

router.post("/:id/:userId", validateToken, async (req, res) => {
  const order = new Orders({
    car: req.params.id,
    user: req.params.userId,
    paymentDetails: req.body.paymentDetails,
  });

  try {
    var response = await order.save();

    return res.status(200).json({
      code: 200,
      message: "Order placed Successfully!",
      data: response,
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
      status: false,
      code: 500,
      data: null,
    });
  }
});

// Get user order detials
router.get("/:userId", validateToken, async (req, res) => {
  try {
    var response = await Orders.find({ user: req.params.userId })
      .populate({
        path: "car",
        populate: [
          { path: "vehicleSummary" },
          { path: "vehicleTechSpecs" },
          { path: "vehicleStandardEquipment" },
          { path: "owner" },
        ],
      })
      .populate("user");

    return res.status(200).json({
      code: 200,
      message: "Cart items fetched Successfully!",
      data: response,
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
      status: false,
      code: 500,
      data: null,
    });
  }
});

// Get user order details items by seller
router.get("/seller/:userId", validateToken, async (req, res) => {
  try {
    const response = await Orders.find()
      .populate({
        path: "car",
        match: { owner: new mongoose.Types.ObjectId(req.params.userId) },
        populate: [
          { path: "vehicleSummary" },
          { path: "vehicleTechSpecs" },
          { path: "vehicleStandardEquipment" },
          { path: "owner" },
        ],
      })
      .populate("user");

    return res.status(200).json({
      code: 200,
      message: "Order details fetched Successfully!",
      data: response,
      status: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
      status: false,
      code: 500,
      data: null,
    });
  }
});

// Get order details
router.get("/details/:id", validateToken, async (req, res) => {
  try {
    const response = await Orders.findById(req.params.id)
      .populate({
        path: "car",
        populate: [
          { path: "vehicleSummary" },
          { path: "vehicleTechSpecs" },
          { path: "vehicleStandardEquipment" },
          { path: "owner" },
        ],
      })
      .populate("user");

    return res.status(200).json({
      code: 200,
      message: "Order details fetched Successfully!",
      data: response,
      status: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
      status: false,
      code: 500,
      data: null,
    });
  }
});

module.exports = router;
