const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.middleware");
const VenueController = require("../controllers/venue.controller");

router.get("/", VenueController.GetVenues);
router.post("/", VenueController.CreateVenue);

// router.get("/filters", VenueController.GetFilters);

router.get("/:id", auth, VenueController.GetVenueById);
router.get("/user/:id", auth, VenueController.GetVenueByUserId);
router.patch("/:id", auth, VenueController.UpdateVenue);
router.delete("/:id", auth, VenueController.DeleteVenue);

router.get("/:id/availability", auth, VenueController.GetVenueAvailability);

module.exports = router;
