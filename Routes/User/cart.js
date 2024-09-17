const express = require("express");
const router = express.Router();
const Cart = require("../../Model/Cart/cart");
const validateToken = require("../../Middleware/auth-middleware").validateToken;

router.post("/:id/:userId", validateToken, async (req, res) => {
  const cart = new Cart({
    car: req.params.id,
    user: req.params.userId,
  });

  try {
    var response = await cart.save();

    return res.status(200).json({
      code: 200,
      message: "Car added to cart Successfully!",
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
    var response = await Cart.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      code: 200,
      message: "Cart item deleted Successfully!",
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

// Get user cart items
router.get("/:userId", validateToken, async (req, res) => {
  try {
    var response = await Cart.find({ user: req.params.userId })
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

module.exports = router;
