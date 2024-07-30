const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
const app = express();
// require('dotenv').config()

app.use(cors({
  origin: "*",
}));

const accountSid = "AC6a1a806b938876c709122933f1e4ccc9";

const authToken = " 43c056dbc7bc636e495555d858a3f837";
module.exports = { accountSid, authToken }


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
