const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleTechSpecsSchema = new Schema(
  {
    battery: { type: String, required: false },
    dimensions: { type: String, required: false },
    engineAndDriveTrain: { type: String, required: false },
    general: { type: String, required: false },
    performance: { type: String, required: false },
  },
  { timestamps: true }
);

const VehicleTechSpecs = mongoose.model(
  "VehicleTechSpecs",
  vehicleTechSpecsSchema
);

module.exports = VehicleTechSpecs;
