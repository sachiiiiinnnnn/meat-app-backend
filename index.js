const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
const app = express();

app.use(cors({
  origin: "*",
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads/products')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads/category')));


require("./App/Routes/Router")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
