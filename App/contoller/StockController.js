const StockModal = require("../Modal/StockModal");

exports.Stock = (req, res) => {
  const { stock, stockDate, categoryId, productId } = req.body;
  try {
    if (!stock || !stockDate || !categoryId || !productId) {
      res.status(400).send({ message: "Check Data" });
    } else {
        const stockData = { stock, stockDate, categoryId, productId };
        StockModal.Stock(stockData, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (e) {
    throw e;
  }
};

exports.getStock = (req, res) => {
  try {
    StockModal.getStock((err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (error) {
    throw error;
  }
};

exports.updateStock = (req, res) => {
  const { stockId, stock } = req.body;
  try {
    if (!stockId || !stock) {
      res.status(400).send({ message: "Check Data" });
    } else {
      StockModal.updateStock(req.body, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (error) {
    throw error;
  }
};

exports.deleteStock = (req,res) => {
    const stockId = req.query.stockId;
    try {
        if(!stockId) {
            res.status(400).send({message: "Check Data"})
        } else {
            StockModal.stockDelete(stockId, (err, data) => {
                if(err) res.status(400).send(err.error);
                else res.send(data);
            })
        }
        
    } catch (error) {
        throw(error);
    }
}
