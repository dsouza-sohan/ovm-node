const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    sellerType: { type: String, required: true, enum: ['Private Owner', 'Dealer'] },
    contactInformation: {
      phoneNumber: { type: String, required: true },
      emailAddress: { type: String, required: true }
    },
    preferredContactMethod: { type: String, required: false, enum: ['Phone', 'Email', 'Messaging'] }
  }, { timestamps: true });
  
  const Seller = mongoose.model('Seller', sellerSchema);
  
  module.exports = Seller;
  