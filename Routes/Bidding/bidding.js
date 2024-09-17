const express = require("express");
const router = express.Router();
const Bidding = require("../../Model/Bidding/bidding");
const Car = require("../../Model/Car/car");
const validateToken = require("../../Middleware/auth-middleware").validateToken;
const mongoose = require("mongoose");

router.post("/:id/:userId", validateToken, async (req, res) => {
  const bidding = new Bidding({
    car: req.params.id,
    user: req.params.userId,
    bidAmount: req.body.bidAmount,
  });

  try {
    var response = await bidding.save();

    return res.status(200).json({
      code: 200,
      message: "Bid sent Successfully!",
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

// Get user Bidding items by user
router.get("/:userId", validateToken, async (req, res) => {
  try {
    var response = await Bidding.find({ user: req.params.userId })
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
      message: "Bidding items fetched Successfully!",
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

// Get user Bidding items by user
router.get("/details/:id", validateToken, async (req, res) => {
  try {
    var response = await Bidding.findById(req.params.id)
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
      message: "Bidding details fetched Successfully!",
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

// Get user Bidding items by seller
router.get("/seller/:userId", validateToken, async (req, res) => {
  try {
    const response = await Bidding.find()
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
      message: "Bidding items fetched Successfully!",
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

// accept bid
router.patch("/accept/:id", validateToken, async (req, res) => {
  try {
    const bidId = req.params.id;

    // Update only the isAccepted field
    const updatedBid = await Bidding.findByIdAndUpdate(
      bidId,
      { $set: { isAccepted: req.body.isAccepted } },
      { new: true, runValidators: true }
    );

    if (!updatedBid) {
      return res.status(404).json({ message: "Car not found", status: false });
    }

    return res.status(200).json({
      code: 200,
      message: "Bid approved successfully!",
      data: updatedBid,
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      status: false,
      code: 500,
      data: null,
    });
  }
});

module.exports = router;
