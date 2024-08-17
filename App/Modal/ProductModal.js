const fs = require('fs');
const path = require('path');
const pool = require("../Configuration/Config");

const ProductModal = function (req) {};

const baseUrl = "http://192.168.1.4:8080/uploads/products"; // Update this with your server address

ProductModal.product = (input, output) => {
  const { productName, productDescription, mass, pieces, price, categoryId, image, productStatus, quantity, bestSeller } = input;
  const insertProduct = `INSERT INTO productDetails (productName, productDescription, mass, pieces, price, categoryId, image, productStatus, quantity, bestSeller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(insertProduct, [productName, productDescription, mass, pieces, price, categoryId, image, productStatus,  quantity, bestSeller], (err, result) => {
    if (err) output({ error: { description: err.message } }, null);
    else {
      output(null, { message: "Product details inserted successfully", result });
    }
  });
};

ProductModal.getProduct = (callback) => {
  const getProduct = `SELECT * FROM productDetails `;

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


ProductModal.getbestSeller = (callback) => {
  const getBestSeller = `SELECT * FROM productDetails WHERE bestSeller = 1`;

  pool.query(getBestSeller, (err, result) => {
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

ProductModal.getProductByCategory = (categoryId, callback) => {
  const query = 'SELECT * FROM productDetails WHERE categoryId = ? AND productStatus =1';
  pool.query(query, [categoryId], (err, results) => {
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

ProductModal.getProductByCategoryAll = (categoryId, callback) => {
  const query = 'SELECT * FROM productDetails WHERE categoryId = ?';
  pool.query(query, [categoryId], (err, result) => {
    if(err) {
      callback({ error: {description: err.message}}, null);
    } else {
      const modifiedResults = result.map(product => ({
        ...product,
        image: `${baseUrl}/${product.image}`
      }));
      callback(null, modifiedResults);
    }
  })

}

ProductModal.updateProductStatus = (productId, productStatus, callback) => {
 
  
  const updateProductStatusQuery = `UPDATE productDetails SET productStatus = ? WHERE productId = ?`;

  pool.query(updateProductStatusQuery, [productStatus, productId], (err, result) => {
    if (err) {
      return callback({ description: err.message }, null);
    }
    callback(null, { message: "Product status updated successfully" })
  });
};

ProductModal.updateBestSeller = (productId, bestSeller, callback) => {
 
  
  const updateBestSellerQuery = `UPDATE productDetails SET bestSeller = ? WHERE productId = ?`;

  pool.query(updateBestSellerQuery, [bestSeller, productId], (err, result) => {
    if (err) {
      return callback({ description: err.message }, null);
    }
    callback(null, { message: "BestSeller updated successfully" })
  });
};

ProductModal.updateProduct = (input, output) => {
  const { productName, productDescription, mass, pieces, price, image, quantity, productId } = input;


  const updateProduct = `UPDATE productDetails SET productName = ?, productDescription = ?, mass = ?, pieces = ?, price = ?, image = ?, quantity = ? WHERE productId = ?`;

  // First, get the current image to delete the old one
  ProductModal.getProductById(productId, (err, product) => {
    if (err) {
      output({ error: { description: err.message } }, null);
    } else {
      const oldImage = product.image;

      pool.query(updateProduct, [productName, productDescription, mass, pieces, price, image, quantity, productId], (err, result) => {
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
          const getProduct = `SELECT * FROM productDetails WHERE productId = ?`
          pool.query(getProduct, [productId], (err, data) => {
            if(err){
              output({ error: { description: err.message } }, null);
            } else {
              output(null, { message: "Product details updated successfully", data});
            }
          })
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
