const fs = require('fs');
const path = require('path');
const pool = require("../Configuration/Config");

const CategoryModal = function (req) {};

const baseUrl = "http://192.168.1.12:8080/uploads/category"; // Base URL for image access

CategoryModal.category = (input, output) => {
  const categoryName = input.categoryName;
  const categoryDescription = input.categoryDescription;
  const priority = input.priority;
  const image = input.image;

  const insertCategory = `INSERT INTO categorydetails (categoryName, categoryDescription, priority, image) VALUES (?, ?, ?, ?)`;

  pool.query(insertCategory, [categoryName, categoryDescription, priority, image], function (err, result) {
    if (err) output({ error: { description: err.message } }, null);
    else {
      output(null, { message: "Category details inserted successfully" });
    }
  });
};

CategoryModal.getCategory = (input, output) => {
  const getcategory = `SELECT * FROM categorydetails`;

  pool.query(getcategory, function (err, result) {
    if (err) {
      output({ error: { description: err.message } }, null);
    } else {
      // Prepend the base URL to each image path
      const categoriesWithImageUrls = result.map(category => {
        return {
          ...category,
          image: `${baseUrl}/${category.image}`
        };
      });
      output(null, categoriesWithImageUrls);
    }
  });
};


CategoryModal.getCategoryById = (categoryId, callback) => {
  const query = 'SELECT * FROM categorydetails WHERE categoryId = ?';
  pool.query(query, [categoryId], (err, results) => {
    if (err) {
      callback({ error: { description: err.message } }, null);
    } else {
      if (results.length > 0) {
        const category = results[0];
        category.image = `${baseUrl}/${category.image}`; // Prepend the base URL to the image path
        callback(null, category);
      } else {
        callback({ error: { description: "Category not found" } }, null);
      }
    }
  });
};

CategoryModal.updateCategory = (input, output) => {
  const { categoryId, categoryName, categoryDescription, priority, image } = input;

  const updateCategory = `UPDATE categorydetails SET categoryName = ?, categoryDescription = ?, priority = ?, image = ? WHERE categoryId = ?`;

  // First, get the current image to delete the old one
  CategoryModal.getCategoryById(categoryId, (err, category) => {
    if (err) {
      output({ error: { description: err.message } }, null);
    } else {
      const oldImage = category.image;

      pool.query(updateCategory, [categoryName, categoryDescription, priority, image, categoryId], (err, result) => {
        if (err) {
          output({ error: { description: err.message } }, null);
        } else {
          if (image && oldImage) {
            const oldImagePath = path.join(__dirname, '../uploads/category', path.basename(oldImage));
            fs.unlink(oldImagePath, (err) => {
              if (err) {
                console.error(`Error deleting old image: ${err.message}`);
              }
            });
          }
          const getCategory = `SELECT * FROM categorydetails WHERE categoryId = ?`;
          pool.query(getCategory,[categoryId], (err, data) => {
            if(err) {
              output({error: {description: err.message}}, null)
            } else {
              output(null, { message: "Category details updated successfully", data});
            }
          })
        }
      });
    }
  });
};

module.exports = CategoryModal;
