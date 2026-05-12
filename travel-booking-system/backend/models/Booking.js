const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destinationName: {
    type: String,
    required: true,
  },
  travelDate: {
    type: Date,
    required: true,
  },
  numberOfTravelers: {
    type: Number,
    required: true,
  },
  packageType: {
    type: String,
    enum: ['Silver', 'Gold', 'Platinum'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bookingStatus: {
    type: String,
    default: 'Confirmed', // Or 'Pending', 'Cancelled'
  },
  contactAddress: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
