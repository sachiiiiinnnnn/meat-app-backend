const mysql = require("mysql2");

const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "meals",
  port: 3306,
  multipleStatements: true,
});

pool.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  try {
    const createCustomerDetails = `CREATE TABLE IF NOT EXISTS customerDetails (
      customerId INT NOT NULL AUTO_INCREMENT,
      customerName VARCHAR(250) ,
      customerEmail VARCHAR(250) ,
      customerMobile VARCHAR(250) NOT NULL,
      PRIMARY KEY (customerId)
    )`;

    const createCategoryDetails = `CREATE TABLE IF NOT EXISTS categoryDetails (
      categoryId INT NOT NULL AUTO_INCREMENT,
      categoryName VARCHAR(250) NOT NULL,
      categoryDescription VARCHAR(250) NOT NULL,
      priority VARCHAR(250) NOT NULL,
      image VARCHAR(250) NOT NULL,
      PRIMARY KEY (categoryId)
    )`;

    const createProductDetails = `CREATE  TABLE IF NOT EXISTS  productDetails (
    productId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(250) NOT NULL,
    productDescription VARCHAR(250) NOT NULL,
    gram VARCHAR(250) NOT NULL,
    pieces INT NOT NULL,
    price INT NOT NULL,
    stocks INT NOT NULL,
    categoryName VARCHAR(250) NOT NULL,
    image VARCHAR(250) NOT NULL,
    productStatus BOOLEAN NOT NULL,
    FOREIGN KEY (categoryName) REFERENCES categoryDetails(categoryName)
)`;

const createLocationDetails = `CREATE  TABLE IF NOT EXISTS   locationDetails (
    locationId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    location VARCHAR(250) NOT NULL,
    FOREIGN KEY (customerId) REFERENCES customerDetails(customerId)
)`;

const createBookingDetails = `CREATE  TABLE IF NOT EXISTS  bookingDetails (
    bookingId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    customerId INT NOT NULL,
    locationId INT NOT NULL,
    productName VARCHAR(250) NOT NULL,
    quantity INT NOT NULL,
    amount INT NOT NULL,
    bookingDate DATE NOT NULL,
    bookingTime TIME NOT NULL,  -- Added bookingTime with TIME data type
    FOREIGN KEY (productId) REFERENCES productDetails(productId),
    FOREIGN KEY (customerId) REFERENCES customerDetails(customerId),
    FOREIGN KEY (locationId) REFERENCES locationDetails(locationId),
    FOREIGN KEY (categoryId) REFERENCES locationDetails(categoryId)
);`;

const otp = `CREATE  TABLE IF NOT EXISTS otp(
    otpId INT NOT NULL AUTO_INCREMENT,
    otp VARCHAR(250) NOT NULL,
    customerId INT NOT NULL,
    PRIMARY KEY (otpId),
    FOREIGN KEY (customerId) REFERENCES customerDetails(customerId)
);`;

const createstockdetail =`CREATE TABLE IF NOT EXISTs stockdetails (
stockId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
stock INT NOT NULL, 
stockdate DATE NOT NULL, 
categoryId INT NOT NULL,
productId INT NOT NULL, 
FOREIGN KEY (categoryId) REFERENCES categoryDetails(categoryId),
FOREIGN KEY (productId) REFERENCES productDetails(productId)
);`;

    // Execute each query separately
    pool.query(createCustomerDetails, function (err, results, fields) {
      if (err) console.log(err.message);
      else console.log("customerDetails table created successfully");
    });

    pool.query(createCategoryDetails, function (err, results, fields) {
      if (err) console.log(err.message);
      else console.log("categoryDetails table created successfully");
    });

    pool.query(createProductDetails, function (err, results, fields) {
      if (err) console.log(err.message);
      else console.log("productDetails table created successfully");
    });

    pool.query(createLocationDetails, function (err, results, fields) {
      if (err) console.log(err.message);
      else console.log("locationDetails table created successfully");
    });

    pool.query(createBookingDetails, function (err, results, fields) {
      if (err) console.log(err.message);
      else console.log("bookingDetails table created successfully");
    });
    
    pool.query(otp, function (err, results, fields) {
      if (err) console.log(err.message);
      else console.log("otp table created successfully");
    });
    
    pool.query(createstockdetail, function(err, results, fields) {
      if(err) console.log(err.message);
      else console.log("stockdetail table create successfully");
    })
  } catch (e) {
    console.log(e.message);
  }
  
});

module.exports = pool;
