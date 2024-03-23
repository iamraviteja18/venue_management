const express = require("express");
const router = express.Router();

const { auth, hasPermission } = require("../middlewares/auth.middleware");
const BookingController = require("../controllers/booking.controller");

router.post("/", auth, BookingController.CreateBooking);
router.get("/:id", auth, BookingController.GetBookingById);
router.get("/user/:userId", auth, BookingController.GetBookingsByUser);
router.get("/venue/:venueId", auth, BookingController.GetBookingsByVenue);
router.delete("/:id", auth, BookingController.DeleteBooking);

module.exports = router;
