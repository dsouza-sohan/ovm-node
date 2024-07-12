const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featureSchema = new Schema({
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    safetyFeatures: { type: [String], required: false },
    entertainmentFeatures: { type: [String], required: false },
    comfortFeatures: { type: [String], required: false },
    convenienceFeatures: { type: [String], required: false }
  }, { timestamps: true });
  
  const Feature = mongoose.model('Feature', featureSchema);
  
  module.exports = Feature;
  