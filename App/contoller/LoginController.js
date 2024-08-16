const { response } = require("express");
const LoginModal = require("../Modal/LoginModal");

exports.Login = (req, res) => {
  const { otp, customerName, customerEmail, customerId } = req.body;

  try {
    if (!otp || !customerId) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // First, validate the OTP
    LoginModal.login(req.body, (err, result) => {
      if (err) return res.status(400).send(err.error);

      if (result.valid) {
        // OTP is valid, now update user details
        LoginModal.updateUserDetails(req.body, (err, updateResult) => {
          if (err) return res.status(400).send(err.error);

          res.send(updateResult);
        });
      } else {
        // OTP is invalid
        res.status(400).send({ message: "Invalid OTP" });
      }
    });


  } catch (e) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: e.message });
  }
};

exports.getLogin = (req, res) => {
  try {
    LoginModal.getLogin(req, (err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    throw e;
  }
};

exports.getCustomerId = (req, res) => {
  const customerId = req.body.customerId; // Use query parameter for customerId

  try {
    LoginModal.getCustomerId(customerId, (err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.generateOtp = (req, res) => {
  const { customerMobile } = req.body;

  try {
    if (!customerMobile) {
      return res.status(400).send({ message: "Mobile number is required" });
    }

    LoginModal.checkUserExists({ customerMobile }, (err, customerData) => {
      if (err) return res.status(400).send({ error: err.message });

      const customerId = customerData ? customerData.customerId : null;

      const otp = Math.floor(1000 + Math.random() * 9000);

      if (customerId) {
        // User already exists, update OTP
        LoginModal.updateOtp({ otp, customerId }, (err, otpData) => {
          if (err) return res.status(400).send({ error: err.message });
          res.send({ ...otpData, customerId, alreadyExist: true });
          // res.send({ message: "OTP updated and resent successfully", customerId , });
        });
      } else {
        // New user, insert user and generate OTP
        LoginModal.insertUser({ customerMobile }, (err, newCustomerData) => {
          if (err) return res.status(400).send({ error: err.message });
          const newCustomerId = newCustomerData.insertId;

          LoginModal.insertOtp(
            { otp, customerId: newCustomerId },
            (err, otpData) => {
              if (err) return res.status(400).send({ error: err.message });
              res.send({ ...otpData, alreadyExist: false });
              // res.send(otpData);
            }
          );
        });
      }
    });
  } catch (e) {
    res.status(500).send({ message: "Server error", error: e.message });
  }
};

exports.updateLogin = (req, res) => {
  const { customerId, customerName, customerEmail } = req.body;

  try {
    if (!customerId || !customerName || !customerEmail) {
      res.status(400).send({ message: "Check data" });
    } else {
      LoginModal.updateLogin(
        { customerId, customerName, customerEmail },
        (err, data) => {
          if (err) res.status(400).send(err.error);
          else res.send(data);
        }
      );
    }
  } catch (e) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: e.message });
  }
};
