const LocationModal = require("../Modal/LocationModal");

exports.Location = (req, res) => {
  const customerId = req.body.customerId;
  const location = req.body.location;


  try {
    if( !customerId|| !location ){
      res.status(400).send({message:"Check data"})
    }else{
        LocationModal.location(req.body, (err, data) => {
      if (err) res.status(400).send(err.error);
      else res.send(data);
    });
    }
   
  } catch (e) {
    throw e;
  }
};


exports.getLocation = (req, res) => {
  const customerId = req.query.customerId;

  if (!customerId) {
    return res.status(400).send({ error: 'Customer ID is required' });
  }

  LocationModal.getLocation(customerId, (err, data) => {
    if (err) {
      console.error('Error fetching location:', err);
      return res.status(500).send({ error: 'An error occurred while fetching location' });
    }
    res.send(data);
  });
};


exports.deleteLocation = (req, res) => {
    const { locationId } = req.body;
  
    if (!locationId) {
      res.status(400).send({ message: "location ID is required" });
    } else {
        LocationModal.deleteLocation(locationId, (err, data) => {
        if (err) res.status(400).send(err.error);
        else res.send(data);
      });
    }
  };