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
  const offerCode = `${offerType}_${Code}`
  const InputReq =
    !offerType ||
    !offerPercentage ||
    !maxDiscount;
  try {
    if (InputReq) {
      res.status(400).send({ message: "Check data" });
    } else {
      OfferModal.offer(
        { offerCode, ...req.body},
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
  try {
    OfferModal.offerGet((err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    throw e;
  }
};

exports.offerGetByOfferType = (req, res) => {
  const offerType = req.query.offerType;
  try {
    if(!offerType) {
      res.status(400).send({message: "Check data"})
    } else {
      OfferModal.offerGetByOfferType(offerType, (err, data) => {
        if(err) res.status(400).send(err.error);
        else res.send(data);
      })
    }

  } catch (e) {
    throw(e);
  }
}

exports.OfferDelete = (req, res) => {
  const offerId = req.query.offerId;
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
    const offerId = req.body.offerId;
    const offerPercentage = req.body.offerPercentage;
    const maxDiscount = req.body.maxDiscount;
    const usageLimit = req.body.usageLimit;
    const fromDate = req.body.fromDate;
    const endDate = req.body.endDate;

    try {
        if(!offerId || !offerPercentage || !maxDiscount || !fromDate || !endDate) {
            res.status(400).send({ message: "Check data" });
        } else {
    OfferModal.OfferUpdate(offerId, offerPercentage, maxDiscount, usageLimit, fromDate, endDate, (err, data) => {
                if (err) res.status(400).send(err.error);
                else res.send(data);
            }) 
        }

    } catch (e) {
        throw(e);
    }

}
