const CategoryModal = require("../Modal/CategoryModal");

exports.Category = (req, res) => {
  const categoryName = req.body.categoryName;
  const categoryDescription = req.body.categoryDescription;
  const priority = req.body.priority;
  const image = req.file ? req.file.filename : null;

  try {
    if (!categoryName || !categoryDescription || !priority) {
      res.status(400).send({ message: "Check data" });
    } else {
      CategoryModal.category({ ...req.body, image }, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (e) {
    throw e;
  }
};

exports.getCategory = (req, res) => {
  try {
    CategoryModal.getCategory(req, (err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    throw e;
  }
};

exports.updateCategory = (req, res) => {
  const { categoryId, categoryName, categoryDescription, priority } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    if (!categoryId || !categoryName || !categoryDescription || !priority) {
      res.status(400).send({ message: "Check data" });
    } else {
      CategoryModal.updateCategory({ ...req.body, image }, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  } catch (e) {
    throw e;
  }
};

exports.getCategoryById = (req, res) => {
  const categoryId = req.body.categoryId; // Use query parameter for customerId

  try {
    CategoryModal.getCategoryById(categoryId, (err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};