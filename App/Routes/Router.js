module.exports = (App) => {

  const express = require("express");
  const router = express.Router();
  const multer = require('multer');
  const path = require('path');

  const Login = require("../contoller/LoginController");
  const Category = require("../contoller/CategoryController");
  const Product = require("../contoller/ProductContoller");
  const Location = require("../contoller/LocationController");
  const Booking = require("../contoller/BookingController");
  const Search = require("../contoller/SearchController");
  const Stock = require("../contoller/StockController");
  const Offer = require("../contoller/OfferController");
  // const Cart = require("../contoller/CartController");


  


  const categoryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads/category'));
    },
    filename: function (req, file,  cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
  
  const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads/products'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
  
  // Multer instances
  const uploadCategory = multer({ storage: categoryStorage });
  const uploadProduct = multer({ storage: productStorage });





  router.post("/user/Login", Login.Login); 
  router.get("/user/Login", Login.getLogin);
  router.get("/user/Login/CustomerId", Login.getCustomerId);
  router.post("/user/Login/Otp", Login.generateOtp);
  router.put("/user/Login/Edit", Login.updateLogin); 

  
  router.post("/user/Category", uploadCategory.single('image'), Category.Category);
  router.get("/user/Category", Category.getCategory);
  router.get("/user/Category/ById", Category.getCategoryById);
  router.put("/user/Category", uploadCategory.single('image'), Category.updateCategory);


  router.post('/user/Product', uploadProduct.single('image'), Product.Product);
  router.get('/user/Product', Product.getProduct);
  router.get('/user/Product/Id', Product.getProductById);
  router.get('/user/Product/CategoryId', Product.getProductByCategory);
  router.put('/user/Product', uploadProduct.single('image'), Product.updateProduct);
  router.delete('/user/Product', Product.deleteProduct);
  router.get('/user/Product/BestSeller', Product.getBestSeller);

  
  router.post("/user/Location", Location.Location);
  router.get("/user/Location", Location.getLocation);
  router.delete("/user/Location", Location.deleteLocation);

  router.post("/user/Booking", Booking.Booking);
  router.get("/user/Booking", Booking.getBooking);
  router.put("/user/Booking", Booking.updateBooking);

  router.get("/user/Search", Search.getSearch);
  router.get("/user/SearchProduct", Search.getSearchProduct);

  router.post("/user/stock", Stock.Stock);
  router.get("/user/stock", Stock.getStock);
  router.put("/user/stock", Stock.updateStock);
  router.delete("/user/stock", Stock.deleteStock);

  
  router.post("/user/offer", Offer.Offer);
  router.get("/user/offer", Offer.offerGet);
  router.put("/user/offer", Offer.updateOffer)
  router.delete("/user/offer", Offer.OfferDelete);

  // router.post("/user/Cart", Cart.Cart);
  // router.get("/user/Cart", Cart.getCart);

  

  const log = (req, res, next) => {
    const { originalUrl, method, query, body } = req;
    console.log(
      `Url: ${
        originalUrl.split("?")[0]
      } -> Method: ${method} -> Query: ${JSON.stringify(
        query
      )} || Body: ${JSON.stringify(body)} ` 
    );
    next();
  };
  App.use("/api",  router);
  App.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 
};