const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleStandardEquipmentSchema = new Schema(
  {
    audioAndCommunicatons: { type: String },
    exterior: { type: String },
    safetyAndSecurity: { type: String },
    driversAssistance: { type: String },
    illumination: { type: String },
    interior: { type: String },
    performance: { type: String },
  },
  { timestamps: true }
);

const VehicleStandardEquipment = mongoose.model(
  "VehicleStandardEquipment",
  vehicleStandardEquipmentSchema
);

module.exports = VehicleStandardEquipment;
