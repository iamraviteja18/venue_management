const express = require("express");
const router = express.Router();

const DashboardRoute = require("./dashboard.route");
const UserRoute = require("./user.route");
const AuthRoute = require("./auth.route");
const VenueRoute = require("./venue.route");
const BookingRoute = require("./booking.route");
const ChatRoute = require("./chat.route");

router.use("/dashboard", DashboardRoute);
router.use("/user", UserRoute);
router.use("/auth", AuthRoute);
router.use("/venue", VenueRoute);
router.use("/booking", BookingRoute);
router.use("/chat", ChatRoute);

module.exports = router;
