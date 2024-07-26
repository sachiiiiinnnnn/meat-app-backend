const pool = require("../Configuration/Config");
const twilioDeatils = require("../../index")
const client = require("twilio")(twilioDeatils.accountSid, twilioDeatils.authToken);
const { Login } = require("../contoller/LoginController");


const LoginModal = function (req) { };

LoginModal.login = (input, output) => {
  const { otp, customerId } = input;

  const query = `SELECT * FROM otp WHERE otp = ? AND customerId = ?`;

  pool.query(query, [otp, customerId], (err, result) => {
    if (err) return output({ error: { description: err.message } }, null);
    if (result.length > 0) {
      output(null, { valid: true });
    } else {
      output(null, { valid: false });
    }
  });
};

LoginModal.updateUserDetails = (input, output) => {
  const { customerName, customerEmail, customerId } = input;

  const query = `UPDATE customerdetails SET customerName = ?, customerEmail = ? WHERE customerId = ?`;
  const query1 = `SELECT * FROM customerdetails WHERE customerId = ?`;

  pool.query(query, [customerName, customerEmail, customerId], (err, result) => {
    if (err) {
      return output({ error: { description: err.message } }, null);
    }

    pool.query(query1, [customerId], (err, result) => {
      if (err) {
        return output({ error: { description: err.message } }, null);
      }

      output(null, { message: "User details updated successfully", result });
    });
  });
};

LoginModal.getLogin = (input, output) => {

  const getUser = `select * from customerdetails`;

  pool.query(getUser, function (err, result) {
    console.log(err);
    if (err) output({ error: { description: err } }, null);
    else {
      output(null, result);
    }
  });
};


LoginModal.getCustomerId = (customerId, output) => {
  let query = `SELECT * FROM customerdetails`;
  let params = [];

  if (customerId) {
    query += ` WHERE customerId = ?`;
    params.push(customerId);
  }

  pool.query(query, params, (err, result) => {
    if (err) output({ error: { description: err.message } }, null);
    else {
      output(null, result);
    }
  });
};

LoginModal.checkUserExists = ({ customerMobile }, output) => {
  const query = `SELECT * FROM customerdetails WHERE customerMobile = ?`;

  pool.query(query, [customerMobile], (err, result) => {
    if (err) return output({ error: { description: err.message } }, null);
    output(null, result.length > 0 ? result[0] : null);
  });
};

LoginModal.insertUser = (input, output) => {
  const { customerMobile } = input;

  const insertUser = `INSERT INTO customerdetails (customerMobile) VALUES (?)`;

  pool.query(insertUser, [customerMobile], (err, result) => {
    if (err) return output({ error: { description: err.message } }, null);
    output(null, { insertId: result.insertId });
  });
};

LoginModal.insertOtp = (input, output) => {
  const { otp, customerId } = input;

  const insertOtp = `INSERT INTO otp (otp, customerId) VALUES (?, ?)`;

  pool.query(insertOtp, [otp, customerId], (err, result) => {
    if (err) return output({ error: { description: err.message } }, null);
    client.messages
      .create({
        body: `Dear Customer, this is your OTP ${otp} `,
        from: "+19123015569",
        to: "+918220877296",
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.error("Error sending message:", error));
    output(null, { message: "OTP generated and saved successfully", customerId: customerId });
  });
};

LoginModal.updateOtp = (input, output) => {
  const { otp, customerId } = input;

  const updateOtp = `UPDATE otp SET otp = ? WHERE customerId = ?`;

  pool.query(updateOtp, [otp, customerId], (err, result) => {
    if (err) return output({ error: { description: err.message } }, null);
    client.messages
      .create({
        body: `Dear Customer, this is your OTP ${otp} `,
        from: "+19123015569",
        to: "+918220877296",
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.error("Error sending message:", error));
    output(null, { message: "OTP updated successfully" });
  });
};

module.exports = LoginModal;