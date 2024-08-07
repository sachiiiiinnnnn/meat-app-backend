const pool = require("../Configuration/Config");
const ProductModal = require("./ProductModal");
const StockModal = require("./StockModal");
const { format } = require('date-fns');


const BookingModal = function (req) {};

BookingModal.booking = (input, output) => {
    const bookings = Array.isArray(input) ? input : [input]; // Ensure bookings is an array

    const processBooking = (booking, callback) => {
        const { productId, customerId, locationId, quantity, amount, categoryId, paymentMode, bookingDate, bookingStartTime, bookingEndTime, bookingStatus } = booking;

            StockModal.getStockById(productId, bookingDate, categoryId, (productErr, stockDetails) => {
            if (productErr) {
                callback({ error: { description: "Product not found" } });
            } else if (!stockDetails) {
                callback({ error: { description: "Product not found" } });
            } else {
                const stockDate = stockDetails.stockDate;
                if (stockDetails.stock === 0) {
                    callback({ error: { description: "Out of Stock" } });
                } else if (stockDetails.stock < quantity && bookingDate === stockDate) {
                    callback({ error: { description: `Only ${stockDetails.stock} items available in stock` } });
                } else {
                    const insertBooking = `INSERT INTO bookingDetails (productId, customerId, locationId, quantity, amount, paymentMode, bookingDate, bookingStartTime, bookingEndTime, bookingStatus, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    const values = [productId, customerId, locationId, quantity, amount, paymentMode, bookingDate, bookingStartTime, bookingEndTime , bookingStatus, categoryId];
    
                    pool.query(insertBooking, values, (err, result) => {
                        if (err) {
                            callback({ error: { description: err.message } });
                        } else {
                            const updatedStocks = stockDetails.stock - quantity;                         
                            StockModal.UpdatesProductStock(productId, stockDate, updatedStocks, (updateErr, updateData) => {
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

BookingModal.updateBooking = (input, output) => {
        const {bookingId, productId, quantity, bookingDate, categoryId, bookingStatus} = input;

        if(bookingStatus === "cancel") {
            const updateBooking = `UPDATE bookingDetails SET bookingStatus = ? WHERE bookingId = ?`;
            pool.query(updateBooking ,[bookingStatus, bookingId], (err, result) => {
                if(err) {
                    output({error : {description: err.message}}, null);
                } else {
                    const getBooking = `SELECT * FROM bookingDetails WHERE bookingId = ?`;
                    pool.query(getBooking,[bookingId], (err, data) => {
                        if(err) output({error : {description: err.message}}, null);
                        else output(null, data);
                    })
                    StockModal.getStockByDateProCat( productId, bookingDate, categoryId, (err, data) => {
                        if(err) {
                            output(err, null);
                        } else {
                            const stockVale = {
                                stockId: data[0].stockId,
                                stock: quantity + data[0].stock
                            }
                            StockModal.updateStock(stockVale, (err, data) => {
                                if(err) {
                                    output(err, null);
                                } else {
                                    output(null, data);
                                }
                            })
                        }
                    })
                }
            })
        } else {
            output({ error: { description: "Booking is already cancelled" } }, null);
        }

        
}

module.exports = BookingModal;
