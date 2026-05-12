const Booking = require('../models/Booking');

// Add booking
exports.addBooking = async (req, res) => {
  try {
    const { destinationName, travelDate, numberOfTravelers, packageType, price, contactAddress } = req.body;

    const newBooking = new Booking({
      user: req.user.id,
      destinationName,
      travelDate,
      numberOfTravelers,
      packageType,
      price,
      contactAddress
    });

    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Add Booking Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// View all bookings
exports.getBookings = async (req, res) => {
  try {
    // Only get bookings for the logged-in user
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// View booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check user owns the booking
    if (booking.user.toString() !== req.user.id) {
       return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get Booking By ID Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check user owns the booking
    if (booking.user.toString() !== req.user.id) {
       return res.status(401).json({ message: 'Not authorized' });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(booking);
  } catch (error) {
    console.error('Update Booking Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check user owns the booking
    if (booking.user.toString() !== req.user.id) {
       return res.status(401).json({ message: 'Not authorized' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
  } catch (error) {
    console.error('Delete Booking Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
