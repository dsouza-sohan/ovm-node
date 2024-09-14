const express = require("express");
const router = express.Router();
const Car = require("../../Model/Car/car");
const VehicleStandardEquipment = require("../../Model/Car/vehicleStandardEquipment");
const VehicleSummary = require("../../Model/Car/vehicleSummary");
const VehicleTechSpecs = require("../../Model/Car/vehicleTechSpecs");
const validateToken = require("../../Middleware/auth-middleware").validateToken;

router.post("/", validateToken, async (req, res) => {
  try {
    // Vehicle Standard Equipment
    const vehicleStandardEquipment = new VehicleStandardEquipment({
      audioAndCommunicatons:
        req.body.vehicleStandardEquipment.audioAndCommunicatons,
      exterior: req.body.vehicleStandardEquipment.exterior,
      safetyAndSecurity: req.body.vehicleStandardEquipment.safetyAndSecurity,
      driversAssistance: req.body.vehicleStandardEquipment.driversAssistance,
      illumination: req.body.vehicleStandardEquipment.illumination,
      interior: req.body.vehicleStandardEquipment.interior,
      performance: req.body.vehicleStandardEquipment.performance,
    });

    var vehicleStandardEquipmentResponse =
      await vehicleStandardEquipment.save();

    // Vehicle Summary
    const vehicleSummary = new VehicleSummary({
      driveTrain: req.body.vehicleSummary.driveTrain,
      milesDriven: req.body.vehicleSummary.milesDriven,
      fuelType: req.body.vehicleSummary.fuelType,
      seats: req.body.vehicleSummary.seats,
      doors: req.body.vehicleSummary.doors,
      carType: req.body.vehicleSummary.carType,
      transmission: req.body.vehicleSummary.transmission,
      color: req.body.vehicleSummary.color,
      registrationNumber: req.body.vehicleSummary.registrationNumber,
      owners: req.body.vehicleSummary.owners,
    });

    var vehicleSummaryResponse = await vehicleSummary.save();

    // Vehicle Tech Specs
    const vehicleTechSpecs = new VehicleTechSpecs({
      battery: req.body.vehicleTechSpecs.battery,
      dimensions: req.body.vehicleTechSpecs.dimensions,
      engineAndDriveTrain: req.body.vehicleTechSpecs.engineAndDriveTrain,
      general: req.body.vehicleTechSpecs.general,
      performance: req.body.vehicleTechSpecs.performance,
    });

    var vehicleTechSpecsResponse = await vehicleTechSpecs.save();

    //Save car
    const car = new Car({
      owner: req.decoded._id,
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      vehicleSummary: vehicleSummaryResponse._id,
      mileage: req.body.mileage,
      fuelEconomy: req.body.fuelEconomy,
      ulez: req.body.ulez,
      vehicleDescription: req.body.vehicleDescription,
      vehicleStats: req.body.vehicleStats,
      vehicleFeatures: req.body.vehicleFeatures,
      address: req.body.address,
      vehicleTechSpecs: vehicleTechSpecsResponse._id,
      vehicleStandardEquipment: vehicleStandardEquipmentResponse._id,
    });
    var response = await car.save();

    return res.status(200).json({
      code: 200,
      message: "Car Submitted for Approval Successfully!",
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

//get Car list
router.get("/", async (req, res) => {
  let matchCondition = {};
  if (req.query && req.query.filter) {
    filter = req.query.filter;
    console.log("filter");
    matchCondition = req.query.filter !== "null" ? { isActive: filter } : {};
  }

  try {
    const car = await Car.find().populate(
      "owner vehicleSummary vehicleTechSpecs vehicleStandardEquipment"
    );
    res.status(200).json({
      code: 200,
      message: "Car list fetched successfully",
      data: car,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
      data: null,
      status: false,
    });
  }
});

//get Car by id
router.get("/:carId", async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId).populate(
      "owner vehicleSummary vehicleTechSpecs vehicleStandardEquipment"
    );
    res.status(200).json({
      code: 200,
      message: "Car list fetched successfully",
      data: car,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
      data: null,
      status: false,
    });
  }
});

//delete Car by id
router.delete("/:carId", async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    await VehicleSummary.findByIdAndDelete(car.vehicleSummary);
    await VehicleTechSpecs.findByIdAndDelete(car.vehicleTechSpecs);
    await VehicleStandardEquipment.findByIdAndDelete(
      car.vehicleStandardEquipment
    );
    await Car.findByIdAndDelete(req.params.carId);
    res.status(200).json({
      code: 200,
      message: "Car Details Deleted Successfully",
      data: car,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
      data: null,
      status: false,
    });
  }
});

module.exports = router;
