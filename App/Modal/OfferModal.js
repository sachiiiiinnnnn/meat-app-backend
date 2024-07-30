const pool = require("../Configuration/Config");

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
    formattedFromDate,
    formattedEndDate,
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
      formattedFromDate,
      formattedEndDate,
      customerType,
      customerId,
    ],
    (err, result) => {
      if (err) {
        output({ error: { description: err.message } }, null);
      } else {
        output(null, { message: "Product details inserted successfully", result});
      }
    }
  );
};

OfferModal.offerGet = (callback) => {
  const getOffer = `SELECT * FROM offerdetails`;

  pool.query(getOffer, (err, result) => {
    if (err) {
      callback({ error: { description: err } }, null);
    } else {
      callback(null, result);
    }
  });
};

OfferModal.OfferDelete = (offerId, output) => {
  const deleteOffer = `DELETE FROM offerdetails WHERE offerId = ?`;
  pool.query(deleteOffer, [offerId], (err, data) => {
    if (err) output({ error: { description: err } }, null);
    else output(null, { message: "Offer deleted successfully" });
  });
};

OfferModal.OfferUpdate = (offerId, offerPercentage, maxDiscount, usageLimit, formattedFromDate, formattedEndDate, output) => {

    const updateOffer = `UPDATE offerdetails SET offerPercentage = ?, maxDiscount = ?, usageLimit = ?, fromDate = ?, endDate = ? WHERE OfferId = ?`;

    pool.query(updateOffer, [offerPercentage, maxDiscount, usageLimit, formattedFromDate, formattedEndDate, offerId], (err, result) => {
        if(err) output({error: {description: err}}, null);
        else output(null, {message: "Offer Updated successfully", result});
    })
}

module.exports = OfferModal;
