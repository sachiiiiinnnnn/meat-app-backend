const BookingModal = require("../Modal/BookingModal");
const moment = require("moment-timezone");

exports.Booking = (req, res) => {
  const bookings = Array.isArray(req.body) ? req.body : [req.body]; // Ensure bookings is an array

  const invalidBooking = bookings.some(
    (booking) =>
      !booking.productId ||
      !booking.customerId ||
      !booking.quantity ||
      !booking.amount ||
      !booking.locationId ||
      !booking.categoryId ||
      !booking.paymentMode ||
      !booking.bookingStatus ||
      !booking.bookingStartTime ||
      !booking.bookingEndTime ||
      !booking.bookingDate
  );
  try {
    if (invalidBooking) {
      res.status(400).send({ message: "Check data" });
    } else {
      BookingModal.booking(bookings, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (e) {
    throw e;
  }
};

exports.getBookingCustomerID = (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      res.status(400).send({ message: "Missing parameters" });
    } else {
      BookingModal.getBookingCustomerId(customerId, (err, data) => {
        if (err) {
          console.error("Error retrieving booking:", err); // Log the error for debugging
          res.status(400).send(err.error);
        } else {
          res.send(data);
        }
      });
    }
  } catch (e) {
    console.error("Server error:", e); // Log the exception for debugging
    res.status(500).send({ message: "Server error" });
  }
};

exports.getBooking = (req, res) => {
  try {
    const { customerId, bookingDate, bookingTime } = req.body;

    if (!customerId || !bookingDate || !bookingTime) {
      res.status(400).send({ message: "Missing parameters" });
    } else {
      BookingModal.getBooking(
        customerId,
        bookingDate,
        bookingTime,
        (err, data) => {
          if (err) {
            console.error("Error retrieving booking:", err); // Log the error for debugging
            res.status(400).send(err.error);
          } else {
            res.send(data);
          }
        }
      );
    }
  } catch (e) {
    console.error("Server error:", e); // Log the exception for debugging
    res.status(500).send({ message: "Server error" });
  }
};

exports.getCompletedBooking = (req, res) => {
  try {
    let { offSet, limit } = req.query;
    if (!offSet || !limit) {
      res.status(400).send({ message: "Missing parameters" });
    } else {
      offSet = Number(offSet);
      limit = Number(limit);
      BookingModal.getCompletedBooking(offSet, limit, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).send({ message: "Server error" });
  }
};
exports.getOverallBooking = (req, res) => {
    try {
      let { limit, offSet } = req.query;
      if (!limit || !offSet) {
        res.status(400).send({ message: "Missing parameters" });
      } else {
        offSet = Number(offSet);
        limit = Number(limit);
        BookingModal.getOverallBooking(limit,offSet,(err, data) => {
          if (err) res.status(400).send(err.error);
          res.send(data);
        });
      }
    } catch (e) {
      console.error("Server error:", e); // Log the exception for debugging
      res.status(500).send({ message: "Server error" });
    }
  };

exports.updateBooking = (req, res) => {
  try {
    const {
      bookingId,
      productId,
      quantity,
      bookingDate,
      categoryId,
      bookingStatus,
    } = req.body;
    if (
      !bookingId ||
      !productId ||
      !quantity ||
      !bookingDate ||
      !categoryId ||
      !bookingStatus
    ) {
      res.status(400).send({ message: "Check data" });
      return; // <-- Ensure no further code is executed after sending the response
    }
    BookingModal.updateBooking(req.body, (err, data) => {
      if (err) {
        res.status(400).send(err.error);
        return; // <-- Ensure no further code is executed after sending the response
      } else {
        res.send(data);
      }
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

exports.getbookingByTodayOrAdvanced = (req, res) => {
  try {
    let { bookingTodayOrTommorrow, offSet, limit } = req.query;

    if (!offSet || !limit) {
      return res.status(400).send({ message: "Missing parameters" });
    }

    offSet = Number(offSet);
    limit = Number(limit);

    BookingModal.getbookingByTodayOrAdvanced(
      bookingTodayOrTommorrow,
      offSet,
      limit,
      (err, data) => {
        if (err) {
          return res.status(400).send(err.error);
        } else {
          return res.send(data);
        }
      }
    );
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).send({ message: "Server error" });
  }
};
