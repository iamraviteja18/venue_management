const httpStatus = require("http-status");

const BookingService = require("../services/booking.service");
const UserService = require("../services/user.service");

const GetUpcomingBookings = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = await UserService.GetUserFromToken(token);

    const bookings = await BookingService.ListBookings({
      user_id: user._id,
      start_date: {
        $gte: new Date(),
      },
    });

    res.status(httpStatus.OK).send(bookings);
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
  }
};

const GetUpcomingReservations = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = await UserService.GetUserFromToken(token);

    const bookings = await BookingService.ListBookingsByOwner(user._id);

    res.status(httpStatus.OK).send(bookings);
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
  }
};

module.exports = {
  GetUpcomingBookings,
  GetUpcomingReservations,
};
