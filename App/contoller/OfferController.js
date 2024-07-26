const OfferModal = require("../Modal/OfferModal");

exports.Offer = (req, res) => {
  const offerType = req.body.offerType;
  const categoryId = req.body.categoryId;
  const productId = req.body.productId;
  const offerPercentage = req.body.offerPercentage;
  const maxDiscount = req.body.maxDiscount;
  const usageLimit = req.body.usageLimit;
  const fromDate = req.body.fromDate;
  const endDate = req.body.endDate;
  const customerType = req.body.customerType;
  const customerId = req.body.customerId;
  const Code = Math.floor(1000 + Math.random() * 9000);
  const formattedFromDate = fromDate.split("-").reverse().join("-");
  const formattedEndDate = endDate.split("-").reverse().join("-");
  const offerCode = `${offerType}_${Code}`
  const InputReq =
    !offerType ||
    !categoryId ||
    !productId ||
    !offerPercentage ||
    !maxDiscount ||
    !usageLimit ||
    !fromDate ||
    !endDate ||
    !customerType ||
    !customerId;
  try {
    if (InputReq) {
      res.status(400).send({ message: "Check data" });
    } else {
      OfferModal.offer(
        { offerCode, ...req.body, formattedFromDate, formattedEndDate },
        (err, data) => {
          if (err) res.status(400).send(err.error);
          else res.send(data);
        }
      );
    }
  } catch (e) {
    throw e;
  }
};

exports.offerGet = (req, res) => {
    console.log("success");
  try {
    OfferModal.offerGet((err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    throw e;
  }
};

exports.OfferDelete = (req, res) => {
  const offerId = req.body.offerId;
  try {
    if (!offerId) {
      res.status(400).send({ message: "offer Id is required" });
    } else {
      OfferModal.OfferDelete(offerId, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (e) {
    throw e;
  }
};

exports.updateOffer = (req, res) => {
    console.log("success");
    const offerId = req.body.offerId;
    const offerPercentage = req.body.offerPercentage;
    const maxDiscount = req.body.maxDiscount;
    const usageLimit = req.body.usageLimit;
    const fromDate = req.body.fromDate;
    const endDate = req.body.endDate;

    const formattedFromDate = fromDate.split("-").reverse().join("-");
    const formattedEndDate = endDate.split("-").reverse().join("-");

  console.log(offerId, offerPercentage, maxDiscount, usageLimit, fromDate, endDate,  formattedFromDate,formattedEndDate);

    try {
        if(!offerId || !offerPercentage || !maxDiscount || !usageLimit || !fromDate || !endDate) {
            res.status(400).send({ message: "Check data" });
        } else {
    OfferModal.OfferUpdate(offerId, offerPercentage, maxDiscount, usageLimit, formattedFromDate,formattedEndDate, (err, data) => {
                if (err) res.status(400).send(err.error);
                else res.send(data);
            }) 
        }

    } catch (e) {
        throw(e);
    }

}
