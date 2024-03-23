const httpStatus = require("http-status");

const VenueService = require("../services/venue.service");
const UserService = require("../services/user.service");

const CreateVenue = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = await UserService.GetUserFromToken(token);
    req.body.oid = user._id;
    const venue = await VenueService.CreateVenue(user._id, req.body);
    res.status(httpStatus.CREATED).send(venue);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const GetVenueById = async (req, res) => {
  try {
    const venue = await VenueService.GetVenueById(req.params.id);
    res.status(httpStatus.OK).send(venue);
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
  }
};

const GetVenues = async (req, res) => {
  try {
    const { search, ...filter } = req.query;
    const venues = await VenueService.GetVenuesByFilter(search, filter);
    const filterOptions = await VenueService.GetVenueFilters();
    res.status(httpStatus.OK).send({ venues, filterOptions });
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
  }
};

const GetVenueByUserId = async (req, res) => {
  try {
    const venues = await VenueService.GetVenuesByUserId(req.params.id);
    res.status(httpStatus.OK).send(venues);
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
  }
};

const GetVenueAvailability = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    res.status(httpStatus.OK).send(venue.availability);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const UpdateVenue = async (req, res) => {
  try {
    const venue = await VenueService.GetVenueById(req.params.id);
    if (req.user._id.toString() !== venue.oid.toString()) {
      throw new Error("Unauthorized");
    }
    const updatedVenue = await VenueService.UpdateVenue(
      req.params.id,
      req.body
    );
    res.status(httpStatus.OK).send(updatedVenue);
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
  }
};

const DeleteVenue = async (req, res) => {
  try {
    const venue = await VenueService.GetVenueById(req.params.id);
    if (req.user._id.toString() !== venue.oid.toString()) {
      throw new Error("Unauthorized");
    }
    await VenueService.DeleteVenue(req.params.id);
    res.status(httpStatus.OK).send({ message: "Venue deleted successfully" });
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
  }
};

module.exports = {
  CreateVenue,
  GetVenueById,
  GetVenueByUserId,
  GetVenues,
  GetVenueAvailability,
  UpdateVenue,
  DeleteVenue,
};
