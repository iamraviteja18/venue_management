const Venue = require("../models/venue.model");

const CreateVenue = async (owner, venue_body) => {
  try {
    const newVenue = await Venue.create(venue_body);
    return newVenue;
  } catch (err) {
    throw new Error(err.message);
  }
};

const GetVenueById = async (id) => {
  try {
    const venue = await Venue.findById(id);
    if (!venue) {
      throw new Error("Venue not found");
    }
    return venue;
  } catch (error) {
    throw new Error("Venue not found");
  }
};

const GetVenuesByUserId = async (id) => {
  try {
    const venues = await Venue.find({ oid: id });
    return venues;
  } catch (error) {
    throw new Error("Venues not found");
  }
};

const GetVenuesByFilter = async (search, filters) => {
  try {
    const query = { ...filters };
    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ];
    }
    const venues = await Venue.find(query);
    return venues;
  } catch (err) {
    throw new Error(err.message);
  }
};

const GetVenueFilters = async () => {
  try {
    const cities = await Venue.distinct("location.city");
    const states = await Venue.distinct("location.state");
    return {
      filters: [
        {
          name: "City",
          fieldName: "location.city",
          values: cities,
        },
        {
          name: "State",
          fieldName: "location.state",
          values: states,
        },
      ],
    };
  } catch (err) {
    console.error(err); // Log the error
    throw new Error(err.message);
  }
};

const UpdateVenue = async (id, venue_body) => {
  try {
    const venue = await Venue.findByIdAndUpdate(id, venue_body, { new: true });
    return venue;
  } catch (err) {
    throw new Error(err.message);
  }
};

const DeleteVenue = async (id) => {
  try {
    await Venue.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  CreateVenue,
  GetVenueById,
  GetVenuesByUserId,
  GetVenuesByFilter,
  GetVenueFilters,
  UpdateVenue,
  DeleteVenue,
};
