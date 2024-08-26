const { Message } = require("twilio/lib/twiml/MessagingResponse");
const pool = require("../Configuration/Config");

const ComplaintModal = function (req) {};

ComplaintModal.Complaint = (input, output) => {
  const customerId = input.customerId;
  const issue = input.issue;
  const descriptions = input.descriptions;
  const customerMobile = input.customerMobile;
  const complaintStatus = input.complaintStatus;
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];

  const complaintQuery = `INSERT INTO complaintdetails(customerId,issue,descriptions,customerMobile,complaintStatus,complaintDate) VALUES ('${customerId}', '${issue}','${descriptions}', '${customerMobile}', '${complaintStatus}','${currentDate}')`;
  
  pool.query(complaintQuery,function(err,result){
    console.log(err);
    if (err) output({error:{description:err}},null);
    else{
        output(null,{Message:"Complaintdetails success"})
    }
  })
};
module.exports = ComplaintModal;
