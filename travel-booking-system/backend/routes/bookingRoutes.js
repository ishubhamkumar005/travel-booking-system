const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all booking routes
router.use(authMiddleware);

// POST /api/bookings -> Add booking
router.post('/', bookingController.addBooking);

// GET /api/bookings -> View all bookings
router.get('/', bookingController.getBookings);

// GET /api/bookings/:id -> View booking by ID
router.get('/:id', bookingController.getBookingById);

// PUT /api/bookings/:id -> Update booking
router.put('/:id', bookingController.updateBooking);

// DELETE /api/bookings/:id -> Delete booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
