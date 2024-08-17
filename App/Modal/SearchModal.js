const fs = require('fs');
const path = require('path');
const pool = require("../Configuration/Config");

const SearchModal = function (req) {};

const baseUrl = "http://192.168.0.118:8080/uploads/products"; // Update with your server's base URL for product images

SearchModal.getSearch = (categoryId, productName, callback) => {
    let query = 'SELECT * FROM productDetails WHERE productName LIKE ?';
    const params = [`%${productName}%`];

    if (categoryId) {
        query += ' AND categoryId = ?';  
        params.push(categoryId);
    }

    pool.query(query, params, (err, results) => {
        if (err) {
            callback({ error: { description: err.message } }, null);
        } else {
            const productsWithImageUrls = results.map(product => ({
                ...product,
                image: `${baseUrl}/${product.image}`
            }));
            callback(null, productsWithImageUrls);
        }
    });
};

SearchModal.getSearchProduct = (productName, callback) => {
    const query = 'SELECT * FROM productDetails WHERE productName LIKE ?;';
    const formattedProductName = `%${productName}%`;
    pool.query(query, [formattedProductName], (err, results) => {
        if (err) {
            callback({ error: { description: err.message } }, null);
        } else {
            // Assuming `results` contains `image` field
            const productsWithImageUrls = results.map(product => ({
                ...product,
                image: `${baseUrl}/${product.image}`
            }));
            callback(null, productsWithImageUrls);
        }
    });
};

module.exports = SearchModal;