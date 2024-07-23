const BookingModal = require("../Modal/BookingModal");
const moment = require("moment-timezone");

exports.Booking = (req, res) => {
    const bookings = Array.isArray(req.body) ? req.body : [req.body]; // Ensure bookings is an array

    const invalidBooking = bookings.some(booking =>
        !booking.productId || !booking.customerId || !booking.productName ||
        !booking.quantity || !booking.amount || !booking.locationId
    );

    if (invalidBooking) {
        res.status(400).send({ message: "Check data" });
    } else {
        BookingModal.booking(bookings, (err, data) => {
            if (err) res.status(400).send(err.error);
            else res.send(data);
        });
    }
};

exports.getBooking = (req, res) => {
    try {
        const { customerId, bookingDate, bookingTime } = req.body;

        if (!customerId || !bookingDate || !bookingTime) {
            res.status(400).send({ message: "Missing parameters" });
        } else {
            BookingModal.getBooking(customerId, bookingDate, bookingTime, (err, data) => {
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
