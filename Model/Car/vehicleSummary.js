const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehcileSummarySchema = new Schema(
  {
    driveTrain: {
      type: String,
      required: true,
      enum: ["FWD", "RWD", "AWD", "4x4"],
    },
    milesDriven: { type: Number, required: true },
    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
    seats: { type: Number, required: true },
    doors: { type: Number, required: true },
    carType: {
      type: String,
      required: true,
      enum: ["Hatchback", "Sedan", "SUV", "Van", "Pickup"],
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Automatic", "Manual"],
    },
    color: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    owners: { type: Number, required: true },
  },
  { timestamps: true }
);

const VehicleSummary = mongoose.model("VehicleSummary", vehcileSummarySchema);

module.exports = VehicleSummary;
