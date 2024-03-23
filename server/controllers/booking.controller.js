const httpStatus = require("http-status");

const BookingService = require("../services/booking.service");
const Booking = require("../models/booking.model");

const CreateBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(httpStatus.CREATED).send(booking);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const GetBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.status(httpStatus.OK).send(booking);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const GetBookingsByUser = async (req, res) => {
  try {
    const bookings = await BookingService.ListBookingsByUser(
      req.params.userId,
      req.query
    );
    res.status(httpStatus.OK).send(bookings);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const GetBookingsByVenue = async (req, res) => {
  try {
    const bookings = await BookingService.ListBookingsByVenue(
      req.params.venueId,
      req.query
    );
    res.status(httpStatus.OK).send(bookings);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const DeleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    res.status(httpStatus.OK).send(booking);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

module.exports = {
  CreateBooking,
  GetBookingById,
  GetBookingsByUser,
  GetBookingsByVenue,
  DeleteBooking,
};
