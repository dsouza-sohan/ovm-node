const express = require("express");
const router = express.Router();
const Car = require("../../Model/Car/car");
const VehicleStandardEquipment = require("../../Model/Car/vehicleStandardEquipment");
const VehicleSummary = require("../../Model/Car/vehicleSummary");
const VehicleTechSpecs = require("../../Model/Car/vehicleTechSpecs");
const validateToken = require("../../Middleware/auth-middleware").validateToken;
const Bidding = require("../../Model/Bidding/bidding");
const elasticClient = require("../../elastic");
const axios = require("axios");

router.post("/", validateToken, async (req, res) => {
  try {
    var vehicleStandardEquipmentResponse;
    if (req.body.vehicleStandardEquipment) {
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

      vehicleStandardEquipmentResponse = await vehicleStandardEquipment.save();
    }

    var vehicleSummaryResponse;
    if (req.body.vehicleSummary) {
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

      vehicleSummaryResponse = await vehicleSummary.save();
    }

    var vehicleTechSpecsResponse;
    if (req.body.vehicleTechSpecs) {
      // Vehicle Tech Specs
      const vehicleTechSpecs = new VehicleTechSpecs({
        battery: req.body.vehicleTechSpecs.battery,
        dimensions: req.body.vehicleTechSpecs.dimensions,
        engineAndDriveTrain: req.body.vehicleTechSpecs.engineAndDriveTrain,
        general: req.body.vehicleTechSpecs.general,
        performance: req.body.vehicleTechSpecs.performance,
      });
      vehicleTechSpecsResponse = await vehicleTechSpecs.save();
    }

    //Save car
    const car = new Car({
      owner: req.body.user_id,
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      vehicleSummary: vehicleSummaryResponse?._id,
      mileage: req.body.mileage,
      fuelEconomy: req.body.fuelEconomy,
      ulez: req.body.ulez,
      vehicleDescription: req.body.vehicleDescription,
      vehicleStats: req.body.vehicleStats,
      vehicleFeatures: req.body.vehicleFeatures,
      address: req.body.address,
      vehicleTechSpecs: vehicleTechSpecsResponse?._id,
      vehicleStandardEquipment: vehicleStandardEquipmentResponse?._id,
      isBiddable: req.body.isBiddable,
      price: req.body.price,
      marketType: req.body.marketType,
    });
    var response = await car.save();

    await elasticClient.index({
      index: "post",
      document: {
        owner: req.body.user_id,
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
        vehicleSummary: vehicleSummaryResponse,
        mileage: req.body.mileage,
        fuelEconomy: req.body.fuelEconomy,
        ulez: req.body.ulez,
        vehicleDescription: req.body.vehicleDescription,
        vehicleStats: req.body.vehicleStats,
        vehicleFeatures: req.body.vehicleFeatures,
        address: req.body.address,
        vehicleTechSpecs: vehicleTechSpecsResponse,
        vehicleStandardEquipment: vehicleStandardEquipmentResponse,
        isBiddable: req.body.isBiddable,
        price: req.body.price,
        marketType: req.body.marketType,
      },
    });

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
    const {
      carType,
      marketType,
      brand,
      model,
      isBiddable,
      minPrice,
      maxPrice,
      status,
    } = req.query;
    var vehicleSummaryIds = [];
    // car type
    if (carType) {
      // Find vehicle summaries that match the carType
      const vehicleSummaries = await VehicleSummary.find({ carType });

      // Extract the IDs of the matching vehicle summaries
      vehicleSummaryIds = vehicleSummaries.map((summary) => summary._id) ?? [];
      console.log(vehicleSummaryIds);
    }

    // Build the query object
    const query = {};
    if (carType) {
      query.vehicleSummary = { $in: vehicleSummaryIds };
    }

    if (marketType) {
      query.marketType = { $in: [marketType] };
    }

    if (brand) {
      query.brand = { $in: brand };
    }

    if (model) {
      query.model = { $in: model };
    }

    if (isBiddable) {
      query.isBiddable = { $in: isBiddable };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (status) {
      query.status = { status };
    }

    const car = await Car.find(query)
      .populate(
        "owner vehicleSummary vehicleTechSpecs vehicleStandardEquipment"
      )
      .lean(); // Convert to plain JavaScript objects for easier manipulation

    // Fetch all biddings for each car
    for (const c of car) {
      const biddings = await Bidding.find({ car: c._id }).populate("user");
      c.biddings = biddings; // Attach biddings to the car object
    }

    res.status(200).json({
      code: 200,
      message: "Car list fetched successfully",
      data: car,
      status: true,
    });
  } catch (error) {
    console.log(error);
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
    const car = await Car.findById(req.params.carId)
      .populate(
        "owner vehicleSummary vehicleTechSpecs vehicleStandardEquipment"
      )
      .lean();

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Find all biddings related to this car
    const biddings = await Bidding.find({ car: car._id }).populate("user");

    // Attach the biddings to the car object
    car["biddings"] = biddings;

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

router.patch("/:id", validateToken, async (req, res) => {
  try {
    const carId = req.params.id;

    // Find the existing car
    let car = await Car.findById(carId);
    if (!car) {
      return res
        .status(404)
        .json({ message: "Car not found", status: false, code: 404 });
    }

    // Update Vehicle Standard Equipment if provided
    if (req.body.vehicleStandardEquipment) {
      if (car.vehicleStandardEquipment) {
        // Update existing Vehicle Standard Equipment
        await VehicleStandardEquipment.findByIdAndUpdate(
          car.vehicleStandardEquipment,
          req.body.vehicleStandardEquipment,
          { new: true }
        );
      } else {
        // Create a new Vehicle Standard Equipment document
        const vehicleStandardEquipment = new VehicleStandardEquipment(
          req.body.vehicleStandardEquipment
        );
        const vehicleStandardEquipmentResponse =
          await vehicleStandardEquipment.save();
        car.vehicleStandardEquipment = vehicleStandardEquipmentResponse._id;
      }
    }

    // Update Vehicle Summary if provided
    if (req.body.vehicleSummary) {
      if (car.vehicleSummary) {
        // Update existing Vehicle Summary
        await VehicleSummary.findByIdAndUpdate(
          car.vehicleSummary,
          req.body.vehicleSummary,
          { new: true }
        );
      } else {
        // Create a new Vehicle Summary document
        const vehicleSummary = new VehicleSummary(req.body.vehicleSummary);
        const vehicleSummaryResponse = await vehicleSummary.save();
        car.vehicleSummary = vehicleSummaryResponse._id;
      }
    }

    // Update Vehicle Tech Specs if provided
    if (req.body.vehicleTechSpecs) {
      if (car.vehicleTechSpecs) {
        // Update existing Vehicle Tech Specs
        await VehicleTechSpecs.findByIdAndUpdate(
          car.vehicleTechSpecs,
          req.body.vehicleTechSpecs,
          { new: true }
        );
      } else {
        // Create a new Vehicle Tech Specs document
        const vehicleTechSpecs = new VehicleTechSpecs(
          req.body.vehicleTechSpecs
        );
        const vehicleTechSpecsResponse = await vehicleTechSpecs.save();
        car.vehicleTechSpecs = vehicleTechSpecsResponse._id;
      }
    }

    // Update car fields
    if (req.body.brand) car.brand = req.body.brand;
    if (req.body.model) car.model = req.body.model;
    if (req.body.year) car.year = req.body.year;
    if (req.body.mileage) car.mileage = req.body.mileage;
    if (req.body.fuelEconomy) car.fuelEconomy = req.body.fuelEconomy;
    if (req.body.ulez) car.ulez = req.body.ulez;
    if (req.body.vehicleDescription)
      car.vehicleDescription = req.body.vehicleDescription;
    if (req.body.vehicleStats) car.vehicleStats = req.body.vehicleStats;
    if (req.body.vehicleFeatures)
      car.vehicleFeatures = req.body.vehicleFeatures;
    if (req.body.address) car.address = req.body.address;
    if (req.body.isBiddable) car.isBiddable = req.body.isBiddable;
    if (req.body.price) car.price = req.body.price;
    if (req.body.marketType) car.markeType = req.body.marketType;

    // Save the updated car
    const updatedCar = await car.save();

    return res.status(200).json({
      code: 200,
      message: "Car updated successfully!",
      data: updatedCar,
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

router.patch("/:id/status", validateToken, async (req, res) => {
  try {
    const carId = req.params.id;

    // Ensure the status field is provided
    if (!req.body.status) {
      return res
        .status(400)
        .json({ message: "Status is required", status: false });
    }

    // Update only the status field
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { $set: { status: req.body.status } },
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found", status: false });
    }

    return res.status(200).json({
      code: 200,
      message: "Car approved successfully!",
      data: updatedCar,
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

//get Car by id
router.get("/brand/model", async (req, res) => {
  try {
    const apiResponse = await axios.get(
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?limit=100"
    );
    console.log(apiResponse.data);

    res.status(200).json({
      code: 200,
      message: "Car list fetched successfully",
      data: apiResponse.data,
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      message: error,
      data: null,
      status: false,
    });
  }
});

module.exports = router;
