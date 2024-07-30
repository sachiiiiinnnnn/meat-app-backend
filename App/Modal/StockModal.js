const pool = require("../Configuration/Config");

const StockModal = function (req) {};

StockModal.Stock = (input, output) => {
  const { stock, stockDate, categoryId, productId } = input;

  const insertStock = `INSERT INTO stockdetails (stock, stockDate, categoryId, productId) VALUES (?, ?, ?, ?)`;
  pool.query(insertStock, [stock, stockDate, categoryId, productId], (err, result) => {
    if(err) {
        output({ error: { description: err.message } }, null);
      } else {
        output(null, { message: "stock details inserted successfully", result});
      }
    }
  );
};

StockModal.getStock = (callback) => {
  const getStock = `SELECT * FROM stockdetails`;
  pool.query(getStock, (err, result) => {
    if (err) {
      callback({ error: { description: err.message } }, null);
    } else {
      callback(null, result);
    }
  });
};

StockModal.updateStock = (input, output) => {
  const { stockId, stock } = input;
  const updateStock = `UPDATE stockdetails SET stock = ? WHERE stockId =?`;
  pool.query(updateStock, [stock, stockId], (err, result) => {
    if(err) output({error: {description: err}}, null);
    else output(null, {message: "stock updated successfully"}, null)
  })
};

StockModal.UpdatesProductStock = (productId, StockDate, newStock, output) => {
  const updateStockQuery = `UPDATE stockdetails SET stock = ? WHERE productId = ? && stockDate = ?`;
  pool.query(updateStockQuery, [newStock, productId, StockDate], (err, result) => {
    if (err) {
      output({ error: { description: err.message } }, null);
    } else {
      output(null, { message: "Product stock updated successfully"});
    }
  });
};

StockModal.stockDelete = (stockId, output) => {
    const deleteStock = `DELETE FROM stockdetails WHERE stockId = ?`;
    pool.query(deleteStock, [stockId], (err, result) => {
        if(err) output({error : {description: err.message} }, null);
        else output(null, {message: "Stock deleted successfully"})
    })
}

StockModal.getStockById = (productId, bookingDate, callback) => {
  const query = 'SELECT * FROM stockdetails WHERE productId = ? && stockDate = ?';
  pool.query(query, [productId, bookingDate], (err, results) => {
    if (err) {
      callback({ error: { description: err.message } }, null);
    } else {
      if (results.length > 0) {
        const product = results[0];
        callback(null, product);
      } else {
        callback({ error: { description: "Product not found" } }, null);
      }
    }
  });
};

module.exports = StockModal;
