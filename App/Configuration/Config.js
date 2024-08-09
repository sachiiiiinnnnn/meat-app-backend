const mysql = require("mysql2");

const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "678905k7",
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
      mass VARCHAR(250) NULL,
      pieces INT NOT NULL,
      price INT NOT NULL,
      categoryId INT NOT NULL,
      image VARCHAR(250) NOT NULL,
      productStatus BOOLEAN NOT NULL,
      quantity INT NOT NULL,
      bestSeller BOOLEAN NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES categoryDetails(categoryId)
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
    categoryId INT NOT NULL,
    customerId INT NOT NULL,
    locationId INT NOT NULL,
    quantity INT NOT NULL,
    amount INT NOT NULL,
    paymentMode VARCHAR(250) NOT NULL,
    bookingDate DATE NOT NULL,
    bookingStartTime TIME NOT NULL,  
    bookingEndTime TIME NOT NULL,  
    FOREIGN KEY (productId) REFERENCES productDetails(productId),
    FOREIGN KEY (customerId) REFERENCES customerDetails(customerId),
    FOREIGN KEY (locationId) REFERENCES locationDetails(locationId),
    FOREIGN KEY (categoryId) REFERENCES categoryDetails(categoryId)
);`;

    const otp = `CREATE  TABLE IF NOT EXISTS otp(
    otpId INT NOT NULL AUTO_INCREMENT,
    otp VARCHAR(250) NOT NULL,
    customerId INT NOT NULL,
    PRIMARY KEY (otpId),
    FOREIGN KEY (customerId) REFERENCES customerDetails(customerId)
);`;

    const createstockdetail = `CREATE TABLE IF NOT EXISTS stockdetails (
  stockId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  stock INT NOT NULL, 
  stockdate DATE NOT NULL, 
  categoryId INT NOT NULL,
  productId INT NOT NULL, 
  FOREIGN KEY (categoryId) REFERENCES categoryDetails(categoryId),
  FOREIGN KEY (productId) REFERENCES productDetails(productId)
);`;

    const createofferdetail = `CREATE TABLE IF NOT EXISTS offerdetails (
    offerId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    offerCode VARCHAR(255) NOT NULL,
    offerType VARCHAR(255) NOT NULL,
    categoryId INT NOT NULL,
    productId INT NOT NULL,
    offerPercentage INT NOT NULL,
    maxDiscount INT NOT NULL,
    usageLimit INT NOT NULL,
    fromDate DATE NOT NULL,
    endDate DATE NOT NULL,
    customerType VARCHAR(255) NOT NULL,
    customerId INT NOT NULL,
    FOREIGN KEY (productId) REFERENCES productDetails(productId),
    FOREIGN KEY (customerId) REFERENCES customerDetails(customerId),
    FOREIGN KEY (categoryId) REFERENCES categoryDetails(categoryId)
    ); `;

//     const createCart = `CREATE TABLE IF NOT EXISTS cart (
//     cartId INT NOT NULL AUTO_INCREMENT,
//     productId INT NOT NULL,
//     customerId INT NOT NULL,
//     count INT,
//     PRIMARY KEY (cartId),
//     FOREIGN KEY (customerId) REFERENCES customerdetails(customerId),
//     FOREIGN KEY (productId) REFERENCES productdetails(productId)
// ); `;

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

    pool.query(createstockdetail, function (err, results, fields) {
      if (err) console.log(err.message);
      else console.log("stockdetail table create successfully");
    });

    pool.query(createofferdetail, function (err, result, fields) {
      if (err) console.log(err.message);
      else console.log("Offerdetail table create successfully");
    });

    
    // pool.query(createCart, function (err, result, fields) {
    //   if (err) console.log(err.message);
    //   else console.log("cart table create successfully");
    // });


  } catch (e) {
    console.log(e.message);
  }
});

module.exports = pool;
