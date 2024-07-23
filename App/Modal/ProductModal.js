const fs = require('fs');
const path = require('path');
const pool = require("../Configuration/Config");

const ProductModal = function (req) {};

const baseUrl = "http://192.168.1.12:8080/uploads/products"; // Update this with your server address

ProductModal.product = (input, output) => {
  const { productName, productDescription, gram, pieces, price, stocks, categoryName, image, productStatus } = input;
  const status = productStatus ? 1 : 0;
  const insertProduct = `INSERT INTO productDetails (productName, productDescription, gram, pieces, price, stocks, categoryName, image, productStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(insertProduct, [productName, productDescription, gram, pieces, price, stocks, categoryName,  , status], (err, result) => {
    if (err) output({ error: { description: err.message } }, null);
    else {
      output(null, { message: "Product details inserted successfully" });
    }
  });
};

ProductModal.getProduct = (callback) => {
  const getProduct = `SELECT * FROM productDetails`;

  pool.query(getProduct, (err, result) => {
    if (err) callback({ error: { description: err.message } }, null);
    else {
      // Prepend the base URL to each image path
      const productsWithImageUrls = result.map(product => {
        return {  
          ...product,
          image: `${baseUrl}/${product.image}`
        };
      });
      callback(null, productsWithImageUrls);
    }
  });
};

ProductModal.getProductById = (productId, callback) => {
  const query = 'SELECT * FROM productDetails WHERE productId = ?';
  pool.query(query, [productId], (err, results) => {
    if (err) {
      callback({ error: { description: err.message } }, null);
    } else {
      if (results.length > 0) {
        const product = results[0];
        product.image = `${baseUrl}/${product.image}`; // Prepend the base URL to the image path
        callback(null, product);
      } else {
        callback({ error: { description: "Product not found" } }, null);
      }
    }
  });
};

ProductModal.getProductByCategory = (categoryName, callback) => {
  const query = 'SELECT * FROM productDetails WHERE categoryName = ?';
  pool.query(query, [categoryName], (err, results) => {
    if (err) {
      callback({ error: { description: err.message } }, null);
    } else {
      // Modify the image path in the results
      const modifiedResults = results.map(product => ({
        ...product,
        image: `${baseUrl}/${product.image}`
      }));
      callback(null, modifiedResults);
    }
  });
};

ProductModal.updateProduct = (input, output) => {
  const { productId, productName, productDescription, gram, pieces, price, stocks, categoryName, image, productStatus } = input;
  const status = productStatus ? 1 : 0;

  const updateProduct = `UPDATE productDetails SET productName = ?, productDescription = ?, gram = ?, pieces = ?, price = ?, stocks = ?, categoryName = ?, image = ?, productStatus = ? WHERE productId = ?`;

  // First, get the current image to delete the old one
  ProductModal.getProductById(productId, (err, product) => {
    if (err) {
      output({ error: { description: err.message } }, null);
    } else {
      const oldImage = product.image;

      pool.query(updateProduct, [productName, productDescription, gram, pieces, price, stocks, categoryName, image, status, productId], (err, result) => {
        if (err) {
          output({ error: { description: err.message } }, null);
        } else {
          if (image && oldImage && image !== oldImage) {
            const oldImagePath = path.join(__dirname, '../uploads/products', oldImage);
            fs.unlink(oldImagePath, (err) => {
              if (err) {
                console.error(`Error deleting old image: ${err.message}`);
              }
            });
          }
          output(null, { message: "Product details updated successfully" });
        }
      });
    }
  });
};

ProductModal.deleteProduct = (productId, output) => {
  const deleteProduct = `DELETE FROM productDetails WHERE productId = ?`;

  pool.query(deleteProduct, [productId], (err, result) => {
    if (err) output({ error: { description: err.message } }, null);
    else output(null, { message: "Product deleted successfully" });
  });
};

ProductModal.updateProductStock = (productId, newStock, output) => {
  const updateStockQuery = `UPDATE productDetails SET stocks = ? WHERE productId = ?`;
  pool.query(updateStockQuery, [newStock, productId], (err, result) => {
    if (err) {
      output({ error: { description: err.message } }, null);
    } else {
      output(null, { message: "Product stock updated successfully" });
    }
  });
};

module.exports = ProductModal;
