const pool = require("../Configuration/Config");
const ProductModal = require("./ProductModal");

const BookingModal = function (req) {};

BookingModal.booking = (input, output) => {
    const bookings = Array.isArray(input) ? input : [input]; // Ensure bookings is an array

    const processBooking = (booking, callback) => {
        const { productId, customerId, locationId, productName, quantity, amount, categoryId, paymentMode, bookingStatus } = booking;
        const bookingDate = new Date().toISOString().split('T')[0]; // Automatically generate current date in 'YYYY-MM-DD' format
        const bookingTime = new Date().toISOString().split('T')[1].split('.')[0]; // Automatically generate current time in 'HH:MM:SS' format

        // Fetch current product details to check stock
        ProductModal.getProductById(productId, (productErr, productData) => {
            if (productErr) {
                callback({ error: { description: productErr.message } });
            } else if (!productData) {
                callback({ error: { description: "Product not found" } });
            } else {
                if (productData.stocks === 0) {
                    callback({ error: { description: "Out of Stock" } });
                } else if (productData.stocks < quantity) {
                    callback({ error: { description: `Only ${productData.stocks} items available in stock` } });
                } else {
                    // Proceed with booking if enough stock is available
                    const insertBooking = `INSERT INTO bookingDetails (productId, customerId, locationId, productName, quantity, amount, paymentMode, bookingDate, bookingTime, bookingStatus, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    const values = [productId, customerId, locationId, productName, quantity, amount, paymentMode, bookingDate, bookingTime, bookingStatus, categoryId];

                    pool.query(insertBooking, values, (err, result) => {
                        if (err) {
                            callback({ error: { description: err.message } });
                        } else {
                            // Calculate updated stock
                            const updatedStocks = productData.stocks - quantity;

                            // Update product stock in productDetails table
                            ProductModal.updateProductStock(productId, updatedStocks, (updateErr, updateData) => {
                                if (updateErr) {
                                    callback({ error: { description: updateErr.message } });
                                } else {
                                    callback(null, "Booking and stock update successful");
                                }
                            });
                        }
                    });
                }
            }
        });
    };

    const bookingPromises = bookings.map((booking) => {
        return new Promise((resolve, reject) => {
            processBooking(booking, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    });

    Promise.all(bookingPromises)
        .then(results => output(null, results))
        .catch(error => output(error, null));
};

BookingModal.getBooking = (customerId, bookingDate, bookingTime, output) => {
    const getBooking = `SELECT * FROM bookingDetails WHERE customerId = ? AND bookingDate = ? AND bookingTime = ?`;
    pool.query(getBooking, [customerId, bookingDate, bookingTime], (err, result) => {
        if (err) {
            output({ error: { description: err.message } }, null);
        } else {
            output(null, result);
        }
    });
};

module.exports = BookingModal;
