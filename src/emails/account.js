const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(email, name) {
  sgMail.send({
    to: email,
    from: "blair.fernandes@rediffmail.com",
    subject: "Welcome to Task Manager",
    text: `Hi ${name}, Welcome to task manager app`,
  });
}

function sendGoodByeEmail(email, name) {
  sgMail.send({
    to: email,
    from: "blair.fernandes@rediffmail.com",
    subject: "Sorry to See You Go",
    text: `Hi ${name},\n We are sorry to see you go. Please let us know if there is anything we could have done to serve you better. \n Thanks & Goodbye`,
  });
}

module.exports = {
  sendWelcomeEmail,
  sendGoodByeEmail,
};
