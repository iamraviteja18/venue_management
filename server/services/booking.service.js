const ObjectId = require("mongoose").Types.ObjectId;
const Booking = require("../models/booking.model");

const ListBookings = async (filters) => {
  try {
    const bookings = await Booking.find(filters);
    return bookings;
  } catch (err) {
    throw new Error(err.message);
  }
};

const ListBookingsByUser = async (user_id, filters) => {
  try {
    const aggregateFilters = [
      {
        $lookup: {
          from: "venues",
          localField: "venue",
          foreignField: "_id",
          as: "venue",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          venue: {
            $arrayElemAt: ["$venue", 0],
          },
          user: {
            $arrayElemAt: ["$user", 0],
          },
        },
      },
      {
        $match: {
          "user._id": new ObjectId(user_id),
        },
      },
    ];

    if (filters.before) {
      aggregateFilters.push({
        $match: {
          endTime: {
            $lt: new Date(filters.before),
          },
        },
      });
    }
    if (filters.after) {
      aggregateFilters.push({
        $match: {
          startTime: {
            $gt: new Date(filters.after),
          },
        },
      });
    }

    const bookings = await Booking.aggregate(aggregateFilters);

    return bookings;
  } catch (err) {
    throw new Error(err.message);
  }
};

const ListBookingsByOwner = async (owner_id) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "venues",
          localField: "venue_id",
          foreignField: "_id",
          as: "venue",
        },
      },
      {
        $match: {
          "venue.oid": owner_id,
        },
      },
    ]);

    return bookings;
  } catch (err) {
    throw new Error(err.message);
  }
};

const ListBookingsByVenue = async (venue_id, filters) => {
  try {
    const aggregateFilters = [
      {
        $lookup: {
          from: "venues",
          localField: "venue",
          foreignField: "_id",
          as: "venue",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          venue: {
            $arrayElemAt: ["$venue", 0],
          },
          user: {
            $arrayElemAt: ["$user", 0],
          },
        },
      },
      {
        $match: {
          "venue._id": new ObjectId(venue_id),
        },
      },
    ];

    if (filters.before) {
      aggregateFilters.push({
        $match: {
          endTime: {
            $lt: new Date(filters.before),
          },
        },
      });
    }
    if (filters.after) {
      aggregateFilters.push({
        $match: {
          startTime: {
            $gt: new Date(filters.after),
          },
        },
      });
    }

    const bookings = await Booking.aggregate(aggregateFilters);

    return bookings;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  ListBookings,
  ListBookingsByUser,
  ListBookingsByOwner,
  ListBookingsByVenue,
};
