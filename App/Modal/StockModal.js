const pool = require("../Configuration/Config");
const moment = require('moment')

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
      const formattedResults = result.map(row => ({
          ...row,
          stockDate: moment(row.stockDate).format('YYYY-MM-DD')
        }));
      callback(null, formattedResults);
    }
  });
};

StockModal.updateStock = (input, output) => {
  const { stockId, stock } = input;
  const updateStock = `UPDATE stockdetails SET stock = ? WHERE stockId =?`;
  pool.query(updateStock, [stock, stockId], (err, result) => {
    if(err){
       output({error: {description: err}}, null);
      } else {
        output(null, {message: "stock updated successfully"})
      }
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

StockModal.getStockById = (productId, bookingDate, categoryId, callback) => {
  const query = 'SELECT * FROM stockdetails WHERE productId = ? && stockDate = ? && categoryId = ?';
  pool.query(query, [productId, bookingDate, categoryId], (err, results) => {
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

StockModal.getStockByDateProCat = (productId, bookingDate, categoryId, callback) => {
    const getwhere = `SELECT * FROM stockdetails WHERE stockDate = ? && categoryId = ? && productId = ?`;
    pool.query(getwhere, [bookingDate, categoryId, productId], (err, result) => {
      if(err) {
        callback({error: { description: "Check Qurey"} }, null);
      } else {
        if (result.length > 0) {
          callback(null, result);
        } else {
          callback({ error: { description: "Product not found" } }, null);
        }
      }
    })
}

module.exports = StockModal;
