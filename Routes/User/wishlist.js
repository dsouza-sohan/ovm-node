const express = require("express");
const router = express.Router();
const Wishlist = require("../../Model/Wishlist/wishlist");
const validateToken = require("../../Middleware/auth-middleware").validateToken;

router.post("/:id/:userId", validateToken, async (req, res) => {
  const wishlist = new Wishlist({
    car: req.params.id,
    user: req.params.userId,
  });

  try {
    var response = await wishlist.save();

    return res.status(200).json({
      code: 200,
      message: "Car added to wishlist Successfully!",
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

router.delete("/:id", validateToken, async (req, res) => {
  try {
    var response = await Wishlist.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      code: 200,
      message: "Wishlist item deleted Successfully!",
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

// Get user Wishlist items
router.get("/:userId", validateToken, async (req, res) => {
  try {
    var response = await Wishlist.find({ user: req.params.userId })
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
      message: "Wishlist items fetched Successfully!",
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

module.exports = router;
