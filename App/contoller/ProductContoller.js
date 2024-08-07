const { param } = require("express/lib/request");
const ProductModal = require("../Modal/ProductModal");

exports.Product = (req, res) => {
  const {
    productName,
    productDescription,
    pieces,
    price,
    categoryId,
    quantity,
  } = req.body;
  const image = req.file ? req.file.filename : null;
  const productStatus = req.body.productStatus === "true" ? 1 : 0;
  const bestSeller = req.body.bestSeller === "false" ? 0 : 1;

  try {
    if (
      !productName ||
      !productDescription ||
      !pieces ||
      !price ||
      !categoryId ||
      !quantity ||
      !image
    ) {
      res.status(400).send({ message: "Check data" });
    } else {
      ProductModal.product(
        { ...req.body, productStatus, image, bestSeller },
        (err, data) => {
          if (err) res.status(400).send(err.error);
          else res.send(data);
        }
      );
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

exports.getBestSeller = (req, res) => {
  try {
    ProductModal.getbestSeller((err, data) => {
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
  const categoryId = req.query.categoryId;
  try {
    ProductModal.getProductByCategory(categoryId, (err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    throw e;
  }
};

exports.updateProduct = (req, res) => {
  const {
    productId,
    productName,
    productDescription,
    mass,
    pieces,
    price,
    categoryId,
    quantity,
  } = req.body;
  const image = req.file ? req.file.filename : null;
  const productStatus = req.body.productStatus === "true" ? 1 : 0;
  const bestSeller = req.body.bestSeller === "false" ? 0 : 1;

  console.log(req.body);
  console.log(image);
  console.log(productStatus);
  console.log(bestSeller);

  try {
    if (
      !productId ||
      !productName ||
      !productDescription ||
      !mass ||
      !pieces ||
      !price ||
      !categoryId ||
      !quantity ||
      !image
    ) {
      res.status(400).send({ message: "Check data" });
    } else {
      ProductModal.updateProduct(
        {
          productId,
          productName,
          productDescription,
          mass,
          pieces,
          price,
          quantity,
          categoryId,
          image,
          productStatus,
          bestSeller,
        },
        (err, data) => {
          if (err) res.status(400).send(err.error);
          else res.send(data);
        }
      );
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
