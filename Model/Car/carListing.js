const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carListingSchema = new Schema({
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    features: { type: Schema.Types.ObjectId, ref: 'Feature', required: false },
    history: { type: Schema.Types.ObjectId, ref: 'History', required: false },
    media: { type: Schema.Types.ObjectId, ref: 'Media', required: false },
    seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true }
  }, { timestamps: true });
  
  const CarListing = mongoose.model('CarListing', carListingSchema);
  
  module.exports = CarListing;
  