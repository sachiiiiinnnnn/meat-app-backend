const pool = require("../Configuration/Config");

const LocationModal = function (req) {};

LocationModal.location = (input, output) => {
    const customerId = input.customerId;
    const location = input.location;

  // Use template literals and escape single quotes in values
  const insertLocation = `INSERT INTO locationDetails (customerId, location) VALUES ( '${customerId}', '${location}')`;

  pool.query(insertLocation, function (err, result) {
    console.log(err);
    if (err) output({ error: { description: err } }, null);
    else {
      output(null, { message: "locationDetails Success" });
    }
  });
};

LocationModal.getLocation = (input, output) => {
  const getLocation = `SELECT * FROM locationDetails`;

  pool.query(getLocation, function (err, result) {
    console.log(err);
    if (err) output({ error: { description: err } }, null);
    else {
      output(null, result);
    }
  });
};



LocationModal.deleteLocation = (locationId, output) => {
    const deleteLocation = `DELETE FROM locationDetails WHERE locationId = ?`;
  
    pool.query(deleteLocation, [locationId], (err, result) => {
      if (err) output({ error: { description: err.message } }, null);
      else output(null, { message: "Location deleted successfully" });
    });
  };
module.exports = LocationModal;
