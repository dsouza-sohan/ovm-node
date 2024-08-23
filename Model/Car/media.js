const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    photos: { 
       contentType: String, 
      filename: String
    },
    video: { type: String, required: false }
  }, { timestamps: true });
  
  const Media = mongoose.model('Media', mediaSchema);
  
  module.exports = Media;
  