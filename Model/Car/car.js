const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    vehicleSummary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleSummary",
    },
    mileage: { type: Number, required: true },
    fuelEconomy: { type: Number, required: true },
    ulez: { type: String, required: true, enum: ["Yes", "No"] },
    vehicleDescription: { type: String },
    vehicleStats: { type: String },
    vehicleFeatures: { type: String },
    address: { type: Object, required: true },
    vehicleTechSpecs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleTechSpecs",
    },
    vehicleStandardEquipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleStandardEquipment",
    },
    status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
    isActive: { type: Boolean, default: false },
    isBiddable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
