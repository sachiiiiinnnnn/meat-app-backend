const SearchModal = require("../Modal/SearchModal");

exports.getSearch = (req, res) => {
    const categoryId = req.query.categoryId;
    const productName = req.query.productName;

    try {
        SearchModal.getSearch(categoryId, productName, (err, data) => {
            if (err) res.status(400).send(err.error);
            else res.send(data);
        });
    } catch (e) {
        throw e;
    }
};


exports.getSearchProduct = (req, res) => {
  const productName = req.query.productName;

  try {
      SearchModal.getSearchProduct( productName, (err, data) => {
          if (err) res.status(400).send(err.error);
          else res.send(data);
      });
  } catch (e) {
      throw e;
  }
};