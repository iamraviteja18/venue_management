const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.middleware");
const DashboardController = require("../controllers/dashboard.controller");

router.get("/bookings", auth, DashboardController.GetUpcomingBookings);
router.get("/reservations", auth, DashboardController.GetUpcomingReservations);

module.exports = router;
