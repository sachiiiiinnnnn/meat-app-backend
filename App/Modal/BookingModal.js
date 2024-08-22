const pool = require("../Configuration/Config");
const StockModal = require("./StockModal");
const moment = require("moment");

const BookingModal = function (req) {};

const baseUrl = "http://192.168.0.119:8080/uploads/products";

BookingModal.booking = (input, output) => {
  const bookings = Array.isArray(input) ? input : [input]; // Ensure bookings is an array

  const processBooking = (booking, callback) => {
    const {
      productId,
      customerId,
      locationId,
      quantity,
      amount,
      categoryId,
      paymentMode,
      bookingDate,
      bookingStartTime,
      bookingEndTime,
      bookingStatus,
    } = booking;
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0];
    StockModal.getStockById(
      productId,
      bookingDate,
      categoryId,
      (productErr, stockDetails) => {
        if (productErr) {
          callback({ error: { description: "Product not found" } });
        } else if (!stockDetails) {
          callback({ error: { description: "Product not found" } });
        } else {
          const stockDate = stockDetails.stockDate;
          if (stockDetails.stock === 0) {
            callback({ error: { description: "Out of Stock" } });
          } else if (
            stockDetails.stock < quantity &&
            bookingDate === stockDate
          ) {
            callback({
              error: {
                description: `Only ${stockDetails.stock} items available in stock`,
              },
            });
          } else {
            const insertBooking = `INSERT INTO bookingDetails (productId, customerId, locationId, quantity, amount, paymentMode, bookingDate, bookingStartTime, bookingEndTime, bookingStatus, categoryId, orderedDate, orderedTime ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
              productId,
              customerId,
              locationId,
              quantity,
              amount,
              paymentMode,
              bookingDate,
              bookingStartTime,
              bookingEndTime,
              bookingStatus,
              categoryId,
              currentDate,
              currentTime,
            ];

            pool.query(insertBooking, values, (err, result) => {
              if (err) {
                callback({ error: { description: err.message } });
              } else {
                const updatedStocks = stockDetails.stock - quantity;
                StockModal.UpdatesProductStock(
                  productId,
                  stockDate,
                  updatedStocks,
                  (updateErr, updateData) => {
                    if (updateErr) {
                      callback({ error: { description: updateErr.message } });
                    } else {
                      callback(null, "Booking and stock update successful");
                    }
                  }
                );
              }
            });
          }
        }
      }
    );
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
    .then((results) => output(null, results))
    .catch((error) => output(error, null));
};

BookingModal.getBooking = (customerId, bookingDate, bookingTime, output) => {
  const getBooking = `SELECT * FROM bookingDetails WHERE customerId = ? AND bookingDate = ? AND bookingTime = ?`;
  pool.query(
    getBooking,
    [customerId, bookingDate, bookingTime],
    (err, result) => {
      if (err) {
        output({ error: { description: err.message } }, null);
      } else {
        output(null, result);
      }
    }
  );
};

BookingModal.getBookingCustomerId = (customerId, output) => {
  const getBookingCustomerID = `SELECT bookingdetails.*, categorydetails.categoryName, productdetails.productName,productdetails.image, locationdetails.location, customerdetails.customerName, customerdetails.customerMobile FROM bookingdetails 
    JOIN customerdetails 
    ON customerdetails.customerId = bookingdetails.customerId
    JOIN categorydetails
    ON categorydetails.categoryId = bookingdetails.categoryId
    JOIN productdetails
    ON productdetails.productId = bookingdetails.productId
    JOIN locationdetails
    ON locationdetails.locationId = bookingdetails.locationId
    WHERE bookingdetails.customerId = ?;`;
  pool.query(getBookingCustomerID, [customerId], (err, result) => {
    if (err) {
      output({ error: { description: err.message } }, null);
    } else {
      const formattedResults = result.map((booking) => {
        return {
          ...booking,
          bookingDate: moment(booking.bookingDate).format("YYYY-MM-DD"),
          orderedDate: moment(booking.orderedDate).format("YYYY-MM-DD"),
          image: `${baseUrl}/${booking.image}`,
        };
      });
      output(null, formattedResults);
    }
  });
};

BookingModal.getOverallBooking = (limit,offSet,output) => {
  const getBookingQuery = `SELECT bookingdetails.*, categorydetails.categoryName, productdetails.productName, customerdetails.customerName, customerdetails.customerMobile
                            FROM bookingdetails
                            JOIN categorydetails 
                            ON categorydetails.categoryId = bookingdetails.categoryId
                            JOIN productdetails 
                            ON productdetails.productId = bookingdetails.productId
                            JOIN customerdetails
                            ON customerdetails.customerId = bookingdetails.customerId
                            LIMIT ? OFFSET ?;`;
  pool.query(getBookingQuery, [limit,offSet,],(err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      output({ error: { description: err } }, null);
    } else {
      const formattedResults = result.map((row) => ({
        ...row,
        bookingDate: moment(row.bookingDate).format("YYYY-MM-DD"),
      }));
      output(null, formattedResults);
    }
  });
};

BookingModal.getCompletedBooking = (offSet, limit, output) => {
  const getPaymentHistory = `SELECT bookingdetails.*, categorydetails.categoryName, productdetails.productName, customerdetails.customerName, customerdetails.customerMobile
    FROM bookingdetails
    JOIN categorydetails
    ON categorydetails.categoryId = bookingdetails.categoryId
    JOIN productdetails
    ON productdetails.productId = bookingdetails.productId
    JOIN customerdetails
    ON customerdetails.customerId = bookingdetails.customerId
    WHERE bookingdetails.bookingStatus = "completed"
    LIMIT ? OFFSET ?;`;

  pool.query(getPaymentHistory, [limit, offSet], (err, result) => {
    if (err) {
      output({ error: { description: err } }, null);
    } else {
      const fromettedResults = result.map((row) => ({
        ...row,
        bookingDate: moment(row.bookingDate).format("YYYY-MM-DD"),
      }));
      output(null, fromettedResults);
    }
  });
};

// BookingModal.updateBooking = (input, output) => {
//         const {bookingId, productId, quantity, bookingDate, categoryId, bookingStatus} = input;

//         if(bookingStatus === "cancel") {
//             const updateBooking = `UPDATE bookingDetails SET bookingStatus = ? WHERE bookingId = ?`;
//             pool.query(updateBooking ,[bookingStatus, bookingId], (err, result) => {
//                 if(err) {
//                     output({error : {description: err.message}}, null);
//                 } else {
//                     const getBooking = `SELECT * FROM bookingDetails WHERE bookingId = ?`;
//                     pool.query(getBooking,[bookingId], (err, data) => {
//                         if(err) output({error : {description: err.message}}, null);
//                         else output(null, data);
//                     })
//                     StockModal.getStockByDateProCat( productId, bookingDate, categoryId, (err, data) => {
//                         if(err) {
//                             output(err, null);
//                         } else {
//                             const stockVale = {
//                                 stockId: data[0].stockId,
//                                 stock: quantity + data[0].stock
//                             }
//                             StockModal.updateStock(stockVale, (err, data) => {
//                                 if(err) {
//                                     output(err, null);
//                                 } else {
//                                     output(null, data);
//                                 }
//                             })
//                         }
//                     })
//                 }
//             })
//         } else {
//             output({ error: { description: "Booking is already cancelled" } }, null);
//         }
// }
BookingModal.updateBooking = (input, output) => {
  const {
    bookingId,
    productId,
    quantity,
    bookingDate,
    categoryId,
    bookingStatus,
  } = input;

  if (bookingStatus === "cancel") {
    const updateBooking = `UPDATE bookingDetails SET bookingStatus = ? WHERE bookingId = ?`;
    pool.query(updateBooking, [bookingStatus, bookingId], (err, result) => {
      if (err) {
        return output({ error: { description: err.message } }, null); // <-- Ensure the function returns after sending the error
      }

      const getBooking = `SELECT * FROM bookingDetails WHERE bookingId = ?`;
      pool.query(getBooking, [bookingId], (err, data) => {
        if (err) {
          return output({ error: { description: err.message } }, null); // <-- Ensure the function returns after sending the error
        }

        StockModal.getStockByDateProCat(
          productId,
          bookingDate,
          categoryId,
          (err, data) => {
            if (err) {
              return output(err, null); // <-- Ensure the function returns after sending the error
            }

            const stockValue = {
              stockId: data[0].stockId,
              stock: quantity + data[0].stock,
            };

            StockModal.updateStock(stockValue, (err, stockData) => {
              if (err) {
                return output(err, null); // <-- Ensure the function returns after sending the error
              }

              return output(null, { bookingData: data, stockData }); // <-- Ensure the function returns after sending the response
            });
          }
        );
      });
    });
  } else {
    return output(
      { error: { description: "Booking is already cancelled" } },
      null
    ); // <-- Ensure the function returns after sending the response
  }
};

BookingModal.getbookingByTodayOrAdvanced = (
    bookingTodayOrTommorrow,
    offSet,
    limit,
    output
  ) => {
    let getBookingType;
    
    if (bookingTodayOrTommorrow === "Today") {
      getBookingType = `SELECT bookingdetails.*, categorydetails.categoryName, productdetails.productName, locationdetails.location, customerdetails.customerName 
                        FROM bookingdetails 
                        JOIN customerdetails ON customerdetails.customerId = bookingdetails.customerId
                        JOIN categorydetails ON categorydetails.categoryId = bookingdetails.categoryId
                        JOIN productdetails ON productdetails.productId = bookingdetails.productId
                        JOIN locationdetails ON locationdetails.locationId = bookingdetails.locationId
                        WHERE CURRENT_DATE = bookingdetails.bookingDate
                        LIMIT ? OFFSET ?;`;
    } else {
      getBookingType = `SELECT bookingdetails.*, categorydetails.categoryName, productdetails.productName, locationdetails.location, customerdetails.customerName 
                        FROM bookingdetails 
                        JOIN customerdetails ON customerdetails.customerId = bookingdetails.customerId
                        JOIN categorydetails ON categorydetails.categoryId = bookingdetails.categoryId
                        JOIN productdetails ON productdetails.productId = bookingdetails.productId
                        JOIN locationdetails ON locationdetails.locationId = bookingdetails.locationId
                        WHERE CURRENT_DATE < bookingdetails.bookingDate
                        LIMIT ? OFFSET ?;`;
    }
  
    // Use an array for the query parameters
    pool.query(getBookingType, [limit, offSet], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        output({ error: { description: err } }, null);
      } else {
        const formattedResults = result.map((row) => ({
          ...row,
          bookingDate: moment(row.bookingDate).format("YYYY-MM-DD"),
        }));
        output(null, formattedResults);
      }
    });
  };

module.exports = BookingModal;
