const express = require("express");
const router = express.Router();
const Bidding = require("../../Model/Bidding/bidding");
const Car = require("../../Model/Car/car");
const validateToken = require("../../Middleware/auth-middleware").validateToken;
const mongoose = require("mongoose");

router.post("/:id", validateToken, async (req, res) => {
  const bidding = new Bidding({
    car: req.params.id,
    user: req.decoded._id,
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
router.get("/", validateToken, async (req, res) => {
  try {
    var response = await Bidding.find({ user: req.decoded._id })
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
router.get("/seller", validateToken, async (req, res) => {
  try {
    const response = await Bidding.find()
      .populate({
        path: "car",
        match: { owner: new mongoose.Types.ObjectId(req.decoded._id) },
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

module.exports = router;
