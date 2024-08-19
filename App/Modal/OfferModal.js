const pool = require("../Configuration/Config");
const moment = require("moment");
const OfferModal = function (req) {};

OfferModal.offer = (input, output) => {
  const {
    offerCode,
    offerType,
    categoryId,
    productId,
    offerPercentage,
    maxDiscount,
    usageLimit,
    fromDate,
    endDate,
    customerType,
    customerId,
  } = input;

  const insertOffer = `INSERT INTO offerdetails (offerCode, offerType, categoryId, productId, offerPercentage, maxDiscount, usageLimit, fromDate, endDate, customerType, customerId) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
  pool.query(
    insertOffer,
    [
      offerCode,
      offerType,
      categoryId,
      productId,
      offerPercentage,
      maxDiscount,
      usageLimit,
      fromDate,
      endDate,
      customerType,
      customerId,
    ],
    (err, result) => {
      if (err) {
        output({ error: { description: err.message } }, null);
      } else {
        output(null, {
          message: "Product details inserted successfully",
          result,
        });
      }
    }
  );
};

OfferModal.offerGet = (callback) => {
  const getOffer = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName
                    FROM offerdetails 
                    JOIN categorydetails 
                    on categorydetails.categoryId = offerdetails.categoryId
                    JOIN productdetails 
                    on productdetails.productId = offerdetails.productId;`;

  pool.query(getOffer, (err, result) => {
    if (err) {
      callback({ error: { description: err } }, null);
    } else {
      const formattedResults = result.map((row) => ({
        ...row,
        fromDate: moment(row.fromDate).format("YYYY-MM-DD"),
        endDate: moment(row.endDate).format("YYYY-MM-DD"),
      }));
      callback(null, formattedResults);
    }
  });
};
OfferModal.offerGetByOfferType = (offerType, offerStatus, callback) => {  
  if(offerType === "flat") {
    let getOfferByOffType;
    if(offerStatus === "upcoming"){
      getOfferByOffType = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName
                          FROM offerdetails
                          JOIN categorydetails 
                          on categorydetails.categoryId = offerdetails.categoryId
                          JOIN productdetails 
                          on productdetails.productId = offerdetails.productId 
                          WHERE offerdetails.offerType = ? AND CURRENT_DATE < fromDate`;
    } else if(offerStatus === "active") {
      getOfferByOffType = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName
                          FROM offerdetails
                          JOIN categorydetails 
                          on categorydetails.categoryId = offerdetails.categoryId
                          JOIN productdetails 
                          on productdetails.productId = offerdetails.productId 
                          WHERE offerdetails.offerType = ? AND CURRENT_DATE >= fromDate AND CURRENT_DATE <= endDate`;
    } else {
      getOfferByOffType = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName
                          FROM offerdetails
                          JOIN categorydetails 
                          on categorydetails.categoryId = offerdetails.categoryId
                          JOIN productdetails 
                          on productdetails.productId = offerdetails.productId 
                          WHERE offerdetails.offerType = ? AND CURRENT_DATE > endDate`;
    }
    pool.query(getOfferByOffType, [offerType], (err, result) => {
      if (err) {
        callback({ error: { description: err } }, null);
      } else {
        const formattedResults = result.map((row) => ({
          ...row,
          fromDate: moment(row.fromDate).format("YYYY-MM-DD"),
          endDate: moment(row.endDate).format("YYYY-MM-DD"),
        }));
        callback(null, formattedResults);
      }
    });
  } else if (offerType === "first") {
    let getOfferByOffType;
    if(offerStatus === "upcoming"){
      getOfferByOffType = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName
                          FROM offerdetails
                          JOIN categorydetails 
                          on categorydetails.categoryId = offerdetails.categoryId
                          JOIN productdetails 
                          on productdetails.productId = offerdetails.productId 
                          WHERE offerdetails.offerType = ? AND CURRENT_DATE < fromDate`;
    } else if(offerStatus === "active") {
      getOfferByOffType = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName
                          FROM offerdetails
                          JOIN categorydetails 
                          on categorydetails.categoryId = offerdetails.categoryId
                          JOIN productdetails 
                          on productdetails.productId = offerdetails.productId 
                          WHERE offerdetails.offerType = ? AND CURRENT_DATE >= fromDate AND CURRENT_DATE <= endDate`;
    } else {
      getOfferByOffType = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName
                          FROM offerdetails
                          JOIN categorydetails 
                          on categorydetails.categoryId = offerdetails.categoryId
                          JOIN productdetails 
                          on productdetails.productId = offerdetails.productId 
                          WHERE offerdetails.offerType = ? AND CURRENT_DATE > endDate`;
    }
    pool.query(getOfferByOffType, [offerType], (err, result) => {
      if (err) {
        callback({ error: { description: err } }, null);
      } else {
        const formattedResults = result.map((row) => ({
          ...row,
          fromDate: moment(row.fromDate).format("YYYY-MM-DD"),
          endDate: moment(row.endDate).format("YYYY-MM-DD"),
        }));
        callback(null, formattedResults);
      }
    });
  } else if (offerType === "persn") {
    let getOfferByOffType;
    if(offerStatus === "upcoming") {
      getOfferByOffType = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName, customerdetails.customerName
      FROM offerdetails
      JOIN categorydetails
      ON categorydetails.categoryId = offerdetails.categoryId
      JOIN productdetails
      ON productdetails.productId = offerdetails.productId
      JOIN customerdetails
      ON customerdetails.customerId = offerdetails.customerId
      WHERE offerdetails.customerType = "Particular"
      AND offerdetails.customerId IS NOT NULL
      AND CURRENT_DATE < fromDate`;

    } else if(offerStatus === "active") {
      getOfferByOffType = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName, customerdetails.customerName
      FROM offerdetails
      JOIN categorydetails
      ON categorydetails.categoryId = offerdetails.categoryId
      JOIN productdetails
      ON productdetails.productId = offerdetails.productId
      JOIN customerdetails
      ON customerdetails.customerId = offerdetails.customerId
      WHERE offerdetails.customerType = "Particular"
      AND offerdetails.customerId IS NOT NULL
      AND CURRENT_DATE >= fromDate
      AND CURRENT_DATE <= endDate`;

    } else {
      getOfferByOffType = `SELECT offerdetails.*, categorydetails.categoryName, productdetails.productName, customerdetails.customerName
      FROM offerdetails
      JOIN categorydetails
      ON categorydetails.categoryId = offerdetails.categoryId
      JOIN productdetails
      ON productdetails.productId = offerdetails.productId
      JOIN customerdetails
      ON customerdetails.customerId = offerdetails.customerId
      WHERE offerdetails.customerType = "Particular" 
      AND offerdetails.customerId IS NOT NULL
      AND CURRENT_DATE > endDate`;

    }
    pool.query(getOfferByOffType, [offerType], (err, result) => {
      if (err) {
        callback({ error: { description: err } }, null);
      } else {
        const formattedResults = result.map((row) => ({
          ...row,
          fromDate: moment(row.fromDate).format("YYYY-MM-DD"),
          endDate: moment(row.endDate).format("YYYY-MM-DD"),
        }));
        callback(null, formattedResults);
      }
    });
  } else {
    const getOfferByOffType = `SELECT * FROM offerdetails WHERE offerType = ?`;
    pool.query(getOfferByOffType, [offerType], (err, result) => {
      if (err) {
        callback({ error: { description: err } }, null);
      } else {
        callback(null, result);
      }
    });
  }
  

  
};

OfferModal.OfferDelete = (offerId, output) => {
  const deleteOffer = `DELETE FROM offerdetails WHERE offerId = ?`;
  pool.query(deleteOffer, [offerId], (err, data) => {
    if (err) output({ error: { description: err } }, null);
    else output(null, { message: "Offer deleted successfully" });
  });
};

OfferModal.OfferUpdate = (
  offerId,
  offerPercentage,
  maxDiscount,
  usageLimit,
  fromDate,
  endDate,
  output
) => {
  const updateOffer = `UPDATE offerdetails SET offerPercentage = ?, maxDiscount = ?, usageLimit = ?, fromDate = ?, endDate = ? WHERE OfferId = ?`;

  pool.query(
    updateOffer,
    [offerPercentage, maxDiscount, usageLimit, fromDate, endDate, offerId],
    (err, result) => {
      if (err) output({ error: { description: err } }, null);
      else output(null, { message: "Offer Updated successfully", result });
    }
  );
};

module.exports = OfferModal;
