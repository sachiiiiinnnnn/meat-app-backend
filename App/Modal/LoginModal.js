const pool = require("../Configuration/Config");
const twilioDeatils = require("../../index")
const client = require("twilio")(twilioDeatils.accountSid, twilioDeatils.authToken);
const { Login } = require("../contoller/LoginController");

const baseUrl = "http://192.168.0.118:8080/uploads/profile";

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


// LoginModal.login = (input, output) => {
//   const { otp, customerId } = input;

//   const query = `SELECT * FROM otp WHERE otp = ? AND customerId = ?`;

//   pool.query(query, [otp, customerId], (err, result) => {
//     if (err) return output({ error: { description: err.message } }, null);
//   console.log('====================================');
//   console.log(result);
//   console.log('====================================');
//     if (result.length > 0) {
//       const imageUrls = result.map(customer => 
//         customer.image ? `${baseUrl}/${customer.image}` : null
//       );
// console.log('====================================');
// console.log(baseUrl);
// console.log('====================================');
//       output(null, { valid: true, images: imageUrls });
//     } else {
//       output(null, { valid: false, images: [] });
//     }
//   });
// };



LoginModal.updateUserDetails = (input, output) => {
  const { customerName, customerEmail, customerId } = input;

  const query = `UPDATE customerdetails SET customerName = ?, customerEmail = ? WHERE customerId = ?`;
  const query1 = `SELECT * FROM customerdetails WHERE customerId = ?`;

  if (customerName && customerEmail) {
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
}else if (customerId){
  pool.query(query1, [customerId], (err, result) => {
    if (err) {
      return output({ error: { description: err.message } }, null);
    }

    output(null, { result });
  });
} else {
  // Handle case where neither customerName, customerEmail, nor customerId is provided
  output({ error: { description: "Missing required parameters" } }, null);
}
};


LoginModal.getLogin = (input, output) => {
  const getUser = `SELECT * FROM customerdetails`;

  pool.query(getUser, (err, result) => {
    if (err) {
      output({ error: { description: err.message } }, null);
    } else {
      const profileWithImageUrls = result.map(customer => ({
        ...customer,
        image: `${baseUrl}/${customer.image}`
      }));
      output(null, profileWithImageUrls);
    }
  });
};

// Function to retrieve a customer by ID
LoginModal.getCustomerById = (customerId, output) => {
  let query = `SELECT * FROM customerdetails`;
  let params = [];

  if (customerId) {
    query += ` WHERE customerId = ?`;
    params.push(customerId);
  }

  pool.query(query, params, (err, result) => {
    if (err) {
      output({ error: { description: err.message } }, null);
    } else {
      if (result.length > 0) {
        const profileWithImageUrls = result.map(customer => ({
          ...customer,
          image: `${baseUrl}/${customer.customerProfile}`
        }));
        output(null, profileWithImageUrls);
      } else {
        output({ error: { description: "Customer not found" } }, null);
      }
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
    // client.messages
    //   .create({
    //     body: `Dear Customer, this is your OTP ${otp} `,
    //     from: "+19123015569",
    //     to: "+918220877296",
    //   })
    //   .then((message) => console.log(message.sid))
    //   .catch((error) => console.error("Error sending message:", error));
    output(null, { message: "OTP updated successfully" });
  });
};




LoginModal.updateLogin = (input, output) => {
  const { customerId, customerName, customerEmail } = input;

  const updateName = `
    UPDATE customerdetails
    SET customerName = ?, customerEmail = ? 
    WHERE customerId = ?;
  `;

  pool.query(updateName, [customerName, customerEmail, customerId], (err, result) => {
    if (err) {
      return output(err, null);
    } else {
      const getUser = `SELECT customerId, customerName, customerEmail, customerMobile FROM customerdetails WHERE customerId = ?`;

      pool.query(getUser, [customerId], (err, userResult) => {
        if (err) {
          return output(err, null);
        } else {
          return output(null, { result: userResult });
        }
      });
    }
  });
};

LoginModal.UpdateProfile = (customerId, Profileimage, output) => {
  const profile = `UPDATE customerdetails SET image = ? WHERE customerId = ?`;
  pool.query(profile, [Profileimage, customerId], (err, result) => {
    if(err) {
      output({ description: err.message }, null)
    } else {
      output(null, result)
    }
  })
}


// LoginModal.UpdateProfile = (input, output) => {
//   const { customerId, Profileimage } = input;

//   const updateProfileQuery = `UPDATE customerdetails SET customerProfile = ? WHERE customerId = ?`;

//   LoginModal.getCustomerId(customerId, (err, customer) => {
//     if (err) {
//       output({ error: { description: err.message } }, null);
//     } else {
//       const oldProfileImage = customer.customerProfile;

//       pool.query(updateProfileQuery, [Profileimage, customerId], (err, result) => {
//         if (err) {
//           output({ error: { description: err.message } }, null);
//         } else {
//           if (Profileimage && oldProfileImage) {
//             const oldImagePath = path.join(__dirname, '../uploads/profile', path.basename(oldProfileImage));
//             fs.unlink(oldImagePath, (err) => {
//               if (err) {
//                 console.error(`Error deleting old profile image: ${err.message}`);
//               }
//             });
//           }
//           const getCustomerQuery = `SELECT * FROM customerdetails WHERE customerId = ?`;
//           pool.query(getCustomerQuery, [customerId], (err, data) => {
//             if (err) {
//               output({ error: { description: err.message } }, null);
//             } else {
//               output(null, { message: "Customer profile updated successfully", data });
//             }
//           });
//         }
//       });
//     }
//   });
// };


module.exports = LoginModal;