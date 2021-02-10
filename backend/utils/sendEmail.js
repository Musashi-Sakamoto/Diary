require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = (to, token) => {
  const { HOST_URL } = process.env;
  const msg = {
    to,
    from: 'no-reply@example.com', // Use the email address or domain you verified above
    subject: 'Verify Your Email',
    text: `Click on this link to verify your email ${HOST_URL}/verification?token=${token}&email=${to}`,
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  return sgMail.send(msg);
};

module.exports = {
  sendVerificationEmail
};
