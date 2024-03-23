const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  secondary_address: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
    required: true,
  },
},{ _id : false });

const VenueSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    image: { 
      // Base 64 image
      type: String,
    },
    availability: [
      {
        start: {
          type: Date,
          required: true
        },
        end: {
          type: Date,
          required: true,
        },
      },
    ],
    oid: {
      // Owner ID
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
  },
  {
    timestamps: true,
  }
);

const Venue = mongoose.model("Venue", VenueSchema);
module.exports = Venue;
