//*************************Count product code************************************* */



// const fs = require("fs");
// const path = require("path");
// const pool = require("../Configuration/Config");

// const ProductModal = function (req) {};

// const baseUrl = "http://192.168.1.4:8080/uploads/products"; // Update this with your server address

// ProductModal.product = (input, output) => {
//   const {
//     productName,
//     productDescription,
//     mass,
//     pieces,
//     price,
//     categoryId,
//     image,
//     productStatus,
//     quantity,
//     bestSeller,
//   } = input;
//   const insertProduct = `INSERT INTO productDetails (productName, productDescription, mass, pieces, price, categoryId, image, productStatus, quantity, bestSeller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   pool.query(
//     insertProduct,
//     [
//       productName,
//       productDescription,
//       mass,
//       pieces,
//       price,
//       categoryId,
//       image,
//       productStatus,
//       quantity,
//       bestSeller,
//     ],
//     (err, result) => {
//       if (err) output({ error: { description: err.message } }, null);
//       else {
//         output(null, {
//           message: "Product details inserted successfully",
//           result,
//         });
//       }
//     }
//   );
// };

// ProductModal.getProduct = (customerId, callback) => {
//   const getProduct = `SELECT * FROM productDetails`;
//   const getCartCount = `SELECT * FROM cart WHERE customerId = ?`;

//   pool.query(getCartCount, [customerId], (error, output) => {
//     if (error) {
//       callback({ error: { description: error } }, null);
//     } else {
//       // callback(null, output);

//       pool.query(getProduct, (err, result) => {
//         if (err) callback({ error: { description: err.message } }, null);
//         else {
//           const productsWithCounts = result.map((product) => {
//             const cartItem = output.find(
//               (cart) => cart.productId === product.productId
//             );
//             return {
//               ...product,
//               count: cartItem ? cartItem.count : 0,
//               image: `${baseUrl}/${product.image}`,
//             };
//           });
//           callback(null, productsWithCounts);
//         }
//       });
//     }
//   });
// };




// ProductModal.getbestSeller = (customerId,callback) => {
//   const getBestSeller = `SELECT * FROM productDetails WHERE bestSeller = 1`;
//   const getCartCount = `SELECT * FROM cart WHERE customerId = ?`;

//   pool.query(getCartCount, [customerId], (error, output) => {
//     if (error) {
//       callback({ error: { description: error } }, null);
//     } else {
      
//   pool.query(getBestSeller, (err, result) => {
//     if (err) callback({ error: { description: err.message } }, null);
//     else {
//       const productsWithCounts = result.map((product) => {
//         const cartItem = output.find(
//           (cart) => cart.productId === product.productId
//         );
//         return {
//           ...product,
//           count: cartItem ? cartItem.count : 0,
//           image: `${baseUrl}/${product.image}`,
//         };
//       });
//       callback(null, productsWithCounts);
//     }
//   });
// }
// });
// };



// ProductModal.getProductById = (productId, customerId, callback) => {
//   const query = "SELECT * FROM productDetails WHERE productId = ?";
//   const getCartCount = `SELECT * FROM cart WHERE customerId = ?`;

//   pool.query(getCartCount, [customerId], (error, output) => {
//     if (error) {
//       callback({ error: { description: error } }, null);
//     } else {
//       pool.query(query, [productId], (err, results) => {
//         if (err) {
//           callback({ error: { description: err.message } }, null);
//         } else {
//           if (results.length > 0) {
//             const product = results[0];
//             const cartItem = output.find(
//               (cart) => cart.productId === product.productId
//             );
//             product.count = cartItem ? cartItem.count : 0;
//             product.image = `${baseUrl}/${product.image}`; // Prepend the base URL to the image path
//             callback(null, product);
//           } else {
//             callback({ error: { description: "Product not found" } }, null);
//           }
//         }
//       });
//     }
//   });
// };



// ProductModal.getProductByCategory = (categoryId, customerId, callback) => {
//   const query = "SELECT * FROM productDetails WHERE categoryId = ? AND productStatus = 1";
//   const getCartCount = `SELECT * FROM cart WHERE customerId = ?`;

//   pool.query(getCartCount, [customerId], (error, output) => {
//     if (error) {
//       callback({ error: { description: error.message } }, null);
//     } else {
//       pool.query(query, [categoryId], (err, results) => {
//         if (err) {
//           callback({ error: { description: err.message } }, null);
//         } else {
//           // Modify the image path in the results and include cart counts
//           const productsWithCounts = results.map((product) => {
//             const cartItem = output.find(
//               (cart) => cart.productId === product.productId
//             );
//             return {
//               ...product,
//               count: cartItem ? cartItem.count : 0,
//               image: `${baseUrl}/${product.image}`, // Prepend the base URL to the image path
//             };
//           });
//           callback(null, productsWithCounts);
//         }
//       });
//     }
//   });
// };


// ProductModal.updateProduct = (input, output) => {
//   const {
//     productName,
//     productDescription,
//     mass,
//     pieces,
//     price,
//     categoryId,
//     image,
//     productStatus,
//     quantity,
//     bestSeller,
//     productId,
//   } = input;

//   const updateProduct = `UPDATE productDetails SET productName = ?, productDescription = ?, mass = ?, pieces = ?, price = ?, categoryId = ?, image = ?, productStatus = ?,quantity = ?, bestSeller = ? WHERE productId = ?`;

//   // First, get the current image to delete the old one
//   ProductModal.getProductById(productId, (err, product) => {
//     if (err) {
//       output({ error: { description: err.message } }, null);
//     } else {
//       const oldImage = product.image;

//       pool.query(
//         updateProduct,
//         [
//           productName,
//           productDescription,
//           mass,
//           pieces,
//           price,
//           categoryId,
//           image,
//           productStatus,
//           quantity,
//           bestSeller,
//           productId,
//         ],
//         (err, result) => {
//           if (err) {
//             output({ error: { description: err.message } }, null);
//           } else {
//             if (image && oldImage && image !== oldImage) {
//               const oldImagePath = path.join(
//                 __dirname,
//                 "../uploads/products",
//                 oldImage
//               );
//               fs.unlink(oldImagePath, (err) => {
//                 if (err) {
//                   console.error(`Error deleting old image: ${err.message}`);
//                 }
//               });
//             }
//             const getProduct = `SELECT * FROM productDetails WHERE productId = ?`;
//             pool.query(getProduct, [productId], (err, data) => {
//               if (err) {
//                 output({ error: { description: err.message } }, null);
//               } else {
//                 output(null, {
//                   message: "Product details updated successfully",
//                   data,
//                 });
//               }
//             });
//           }
//         }
//       );
//     }
//   });
// };

// ProductModal.deleteProduct = (productId, output) => {
//   const deleteProduct = `DELETE FROM productDetails WHERE productId = ?`;

//   pool.query(deleteProduct, [productId], (err, result) => {
//     if (err) output({ error: { description: err.message } }, null);
//     else output(null, { message: "Product deleted successfully" });
//   });
// };

// ProductModal.updateProductStock = (productId, newStock, output) => {
//   const updateStockQuery = `UPDATE productDetails SET stocks = ? WHERE productId = ?`;
//   pool.query(updateStockQuery, [newStock, productId], (err, result) => {
//     if (err) {
//       output({ error: { description: err.message } }, null);
//     } else {
//       output(null, { message: "Product stock updated successfully" });
//     }
//   });
// };

// module.exports = ProductModal;








//**************************Controller******************************/

// const { param } = require("express/lib/request");
// const ProductModal = require("../Modal/ProductModal");

// exports.Product = (req, res) => {
//   const {
//     productName,
//     productDescription,
//     mass,
//     pieces,
//     price,
//     categoryId,
//     quantity,
//   } = req.body;
//   const image = req.file ? req.file.filename : null;
//   const productStatus = req.body.productStatus === "true" ? 1 : 0;
//   const bestSeller = req.body.bestSeller === "false" ? 0 : 1;

//   try {
//     if (
//       !productName ||
//       !productDescription ||
//       !mass ||
//       !pieces ||
//       !price ||
//       !categoryId ||
//       !quantity ||
//       !image
//     ) {
//       res.status(400).send({ message: "Check data" });
//     } else {
//       ProductModal.product(
//         { ...req.body, productStatus, image, bestSeller },
//         (err, data) => {
//           if (err) res.status(400).send(err.error);
//           else res.send(data);
//         }
//       );
//     }
//   } catch (e) {
//     throw e;
//   }
// };

// exports.getProduct = (req, res) => {
//   const customerId = req.body.customerId;
//   try {
//     ProductModal.getProduct(customerId, (err, data) => {
//       if (err) res.status(400).send(err.error);
//       else res.send(data);
//     });
//   } catch (e) {
//     throw e;
//   }
// };

// exports.getBestSeller = (req, res) => {
//   const customerId = req.body.customerId;
//   try {
//     ProductModal.getbestSeller(customerId,(err, data) => {
//       if (err) res.status(400).send(err.error);
//       else res.send(data);
//     });
//   } catch (e) {
//     throw e;
//   }
// };

// exports.getProductById = (req, res) => {
//   const customerId = req.body.customerId;
//   const productId = req.body.productId;
//   try {
//     ProductModal.getProductById(productId, customerId,(err, data) => {
//       if (err) res.status(400).send(err.error);
//       else res.send(data);
//     });
//   } catch (e) {
//     throw e;
//   }
// };

// exports.getProductByCategory = (req, res) => {
//   const categoryId = req.body.categoryId;
//   const customerId = req.body.customerId;

//   console.log(categoryId);

//   try {
//     ProductModal.getProductByCategory(categoryId,customerId,(err, data) => {
//       if (err) res.status(400).send(err.error);
//       else res.send(data);
//     });
//   } catch (e) {
//     throw e;
//   }
// };

// exports.updateProduct = (req, res) => {
//   const {
//     productId,
//     productName,
//     productDescription,
//     mass,
//     pieces,
//     price,
//     categoryId,
//     quantity,
//   } = req.body;
//   const image = req.file ? req.file.filename : null;
//   const productStatus = req.body.productStatus === "true" ? 1 : 0;
//   const bestSeller = req.body.bestSeller === "false" ? 0 : 1;

//   console.log(req.body);
//   console.log(image);
//   console.log(productStatus);
//   console.log(bestSeller);

//   try {
//     if (
//       !productId ||
//       !productName ||
//       !productDescription ||
//       !mass ||
//       !pieces ||
//       !price ||
//       !categoryId ||
//       !quantity ||
//       !image
//     ) {
//       res.status(400).send({ message: "Check data" });
//     } else {
//       ProductModal.updateProduct(
//         {
//           productId,
//           productName,
//           productDescription,
//           mass,
//           pieces,
//           price,
//           quantity,
//           categoryId,
//           image,
//           productStatus,
//           bestSeller,
//         },
//         (err, data) => {
//           if (err) res.status(400).send(err.error);
//           else res.send(data);
//         }
//       );
//     }
//   } catch (e) {
//     throw e;
//   }
// };

// exports.deleteProduct = (req, res) => {
//   const productId = req.body.productId;

//   try {
//     if (!productId) {
//       res.status(400).send({ message: "Product ID is required" });
//     } else {
//       ProductModal.deleteProduct(productId, (err, data) => {
//         if (err) res.status(400).send(err.error);
//         else res.send(data);
//       });
//     }
//   } catch (e) {
//     throw e;
//   }
// };
