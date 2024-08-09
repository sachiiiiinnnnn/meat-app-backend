// const pool = require("../Configuration/Config");

// const CartModal = function (req) {};

// CartModal.cart = (input, output) => {
//     const customerId = input.customerId;
//     const productId = input.productId;
//     let count = input.count;

//     if (!customerId || !productId || count === undefined) {
//         return output({ error: { description: "Invalid input data" } }, null);
//     }

//     const checkProductQuery = `SELECT * FROM productdetails WHERE productId = ?`;
//     pool.query(checkProductQuery, [productId], (err, results) => {
//         if (err) {
//             return output({ error: { description: err.message } }, null);
//         }
//         if (results.length === 0) {
//             return output({ error: { description: "ProductId does not exist" } }, null);
//         }

//         const checkCartQuery = `SELECT * FROM cart WHERE customerId = ? AND productId = ?`;
//         pool.query(checkCartQuery, [customerId, productId], (err, results) => {
//             if (err) {
//                 return output({ error: { description: err.message } }, null);
//             }

//             if (results.length > 0) {
//                 let currentCount = results[0].count;
//                 let newCount = currentCount + count;

//                 if (newCount <= 0) {
//                     const deleteCartQuery = `DELETE FROM cart WHERE customerId = ? AND productId = ?`;
//                     pool.query(deleteCartQuery, [customerId, productId], (err, result) => {
//                         if (err) {
//                             return output({ error: { description: err.message } }, null);
//                         }
//                         output(null, { message: "Product removed from cart" });
//                     });
//                 } else {
//                     const updateCartQuery = `UPDATE cart SET count = ? WHERE customerId = ? AND productId = ?`;
//                     pool.query(updateCartQuery, [newCount, customerId, productId], (err, result) => {
//                         if (err) {
//                             return output({ error: { description: err.message } }, null);
//                         }
//                         output(null, { message: "Cart details updated successfully" });
//                     });
//                 }
//             } else {
//                 if (count <= 0) {
//                     return output({ error: { description: "Cannot add a product with a count of zero or less" } }, null);
//                 }

//                 const insertCartQuery = `INSERT INTO cart (customerId, productId, count) VALUES (?, ?, ?)`;
//                 pool.query(insertCartQuery, [customerId, productId, count], (err, result) => {
//                     if (err) {
//                         return output({ error: { description: err.message } }, null);
//                     }
//                     output(null, { message: "Cart details added successfully" });
//                 });
//             }
//         });
//     });
// };







// CartModal.getCart = (cartId, callback) => {
//     const getCartQuery = `SELECT * FROM cart WHERE cartId = ?`;
  
//     pool.query(getCartQuery, [cartId], (err, result) => {
//       if (err) {
//         console.error('Error executing query:', err);
//         callback({ error: { description: err } }, null);
//       } else {
//         callback(null, result);
//       }
//     });
//   };
// module.exports = CartModal;
