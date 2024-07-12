const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    accidentHistory: { type: String, required: false },
    serviceHistory: { type: String, required: false },
    ownershipHistory: { type: String, required: false }
  }, { timestamps: true });
  
  const History = mongoose.model('History', historySchema);
  
  module.exports = History;
  