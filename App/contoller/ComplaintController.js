const { response } = require("express");
const ComplaintModal = require("../Modal/ComplaintModal");
const { Message } = require("twilio/lib/twiml/MessagingResponse");

exports.Complaints = (req, res) => {
  const { customerId, issue, descriptions, customerMobile, complaintStatus } = req.query;
  try {
    if(!customerId||!issue||!descriptions||!customerMobile||!complaintStatus){
        return res.status(400).send({Message: "All fields are required"})
    }else{
        ComplaintModal.Complaint(req.query, (err,data)=>{
            if(err) res.status(400).send(err.error);
            else res.send(data);
        })
    }


  } catch (error) {
    throw error;
  }
};
