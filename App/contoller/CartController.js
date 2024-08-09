// const { response } = require("express");
// const CartModal = require("../Modal/CartModal");

// exports.Cart = (req, res) => {
//     const customerId = req.body.customerId;
//     const productId = req.body.productId;
//     const count = req.body.count;
  
//     try {
//         if (!customerId || !productId || !count) {
//             res.status(400).send({ message: "Check data" });
//         } else {
//             CartModal.cart(req.body, (err, data) => {
//                 if (err) res.status(400).send(err.error);
//                 else res.send(data);
//             });
//         }
//     } catch (e) {
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// };

// exports.getCart = (req, res) => {
//     const cartId = req.body.cartId;
  
//     if (!cartId) {
//       return res.status(400).send({ error: 'Cart ID is required' });
//     }
  
//     CartModal.getCart(cartId, (err, data) => {
//       if (err) {
//         console.error('Error fetching Cart:', err);
//         return res.status(500).send({ error: 'An error occurred while fetching Cart' });
//       }
//       res.send(data);
//     });
//   };
