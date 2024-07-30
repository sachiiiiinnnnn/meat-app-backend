const pool = require("../Configuration/Config");
const ProductModal = require("./ProductModal");
const StockModal = require("./StockModal");
const { format } = require('date-fns');


const BookingModal = function (req) {};

BookingModal.booking = (input, output) => {
    const bookings = Array.isArray(input) ? input : [input]; // Ensure bookings is an array

    const processBooking = (booking, callback) => {
        const { productId, customerId, locationId, productName, quantity, amount, categoryId, paymentMode, bookingDate, bookingStartTime, bookingEndTime, bookingStatus } = booking;
      console.log(booking);
        const FormattedBookingDate = bookingDate.split("-").reverse().join("-");
    
        function formatTime(time) {
            const [timeStr, modifier] = time.split(/(AM|PM)/i);
            let [hours, minutes] = timeStr.split(':');
            if (modifier.toUpperCase() === 'PM' && hours !== '12') {
                hours = parseInt(hours, 10) + 12;
            } else if (modifier.toUpperCase() === 'AM' && hours === '12') {
                hours = '00';
            }
            return `${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')}:00`;
        }
        
        const startTime = bookingStartTime.split('-')[0];
        const FormattedBookingStart = formatTime(startTime);
        
        const endTime = bookingEndTime.split('-')[0];
        const FormattedBookingEnd = formatTime(endTime);
    
            StockModal.getStockById(productId, FormattedBookingDate, (productErr, stockDetails) => {
            if (productErr) {
                callback({ error: { description: "Product not found" } });
            } else if (!stockDetails) {
                callback({ error: { description: "Product not found" } });
            } else {
                const stockDateOld = new Date(stockDetails.stockDate);
                const StockDateFormet = format(stockDateOld, 'dd-MM-yyyy');
                const StockDate = format(stockDateOld, 'yyyy-MM-dd');
                if (stockDetails.stock === 0) {
                    callback({ error: { description: "Out of Stock" } });
                } else if (stockDetails.stock < quantity && bookingDate === StockDateFormet) {
                    callback({ error: { description: `Only ${stockDetails.stock} items available in stock` } });
                } else {
                    const insertBooking = `INSERT INTO bookingDetails (productId, customerId, locationId, productName, quantity, amount, paymentMode, bookingDate, bookingStartTime, bookingEndTime, bookingStatus, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    const values = [productId, customerId, locationId, productName, quantity, amount, paymentMode, FormattedBookingDate, FormattedBookingStart,FormattedBookingEnd , bookingStatus, categoryId];
    
                    pool.query(insertBooking, values, (err, result) => {
                        if (err) {
                            callback({ error: { description: err.message } });
                        } else {
                            const updatedStocks = stockDetails.stock - quantity;                         
                            StockModal.UpdatesProductStock(productId, StockDate, updatedStocks, (updateErr, updateData) => {
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
