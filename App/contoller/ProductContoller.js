const { param } = require("express/lib/request");
const ProductModal = require("../Modal/ProductModal");

exports.Product = (req, res) => {
  const productName = req.body.productName;
  const productDescription = req.body.productDescription;
  const gram = req.body.gram;
  const pieces = req.body.pieces;
  const price = req.body.price;
  const stocks = req.body.stocks;
  const categoryName = req.body.categoryName;
  const productStatus = req.body.productStatus === '1' ? 1 : 0;
  const image = req.file ? req.file.filename : null;

  try {
    if (!productName || !productDescription || !gram || !pieces || !price || !stocks || !categoryName) {
      res.status(400).send({ message: "Check data" });
    } else {
      ProductModal.product({ ...req.body, productStatus, image }, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (e) {
    throw e;
  }
};

exports.getProduct = (req, res) => {
  try {
    ProductModal.getProduct((err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    throw e;
  }
};

exports.getProductById = (req, res) => {
  const productId = req.body.productId;
  try {
    ProductModal.getProductById(productId, (err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    throw e;  
  }
};

exports.getProductByCategory = (req, res) => {
  const categoryName = req.query.categoryName;
  try {
    ProductModal.getProductByCategory(categoryName, (err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    throw e;
  }
};

exports.updateProduct = (req, res) => {
  const { productId, productName, productDescription, gram, pieces, price, stocks, categoryName, productStatus } = req.body;
  const image = req.file ? req.file.filename : null;
  const status = productStatus === '1' ? 1 : 0;

  try {
    if (!productId || !productName || !productDescription || !gram || !pieces || !price || !stocks || !categoryName) {
      res.status(400).send({ message: "Check data" });
    } else {
      ProductModal.updateProduct({ productId, productName, productDescription, gram, pieces, price, stocks, categoryName, image, productStatus: status }, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (e) {
    throw e;
  }
};

exports.deleteProduct = (req, res) => {
  const productId = req.body.productId;

  try {
    if (!productId) {
      res.status(400).send({ message: "Product ID is required" });
    } else {
      ProductModal.deleteProduct(productId, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (e) {
    throw e;
  }
};
