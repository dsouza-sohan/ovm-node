const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  bodyType: { type: String, required: true },
  mileage: { type: Number, required: true },
  vin: { type: String, required: true, unique: true },
  condition: { type: String, required: true, enum: ['New', 'Used', 'Certified Pre-Owned'] },
  engineType: { type: String, required: true },
  transmission: { type: String, required: true, enum: ['Automatic', 'Manual'] },
  drivetrain: { type: String, required: true, enum: ['FWD', 'RWD', 'AWD'] },
  fuelType: { type: String, required: true, enum: ['Gasoline', 'Diesel', 'Hybrid', 'Electric'] },
  exteriorColor: { type: String, required: true },
  interiorColor: { type: String, required: true },
  numberOfDoors: { type: Number, required: true },
  numberOfSeats: { type: Number, required: true },
  askingPrice: { type: Number, required: true },
  negotiablePrice: { type: Boolean, required: false, default: false },
  availabilityForTestDrive: { type: Boolean, required: false, default: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  titleStatus: { type: String, required: true, enum: ['Clean', 'Salvage', 'Rebuilt'] },
  currentCondition: { type: String, required: false },
  warrantyInformation: { type: String, required: false },
  reasonForSelling: { type: String, required: false }
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
