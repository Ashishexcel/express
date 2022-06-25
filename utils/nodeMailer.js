const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'ashishjobworkmail@gmail.com', // generated ethereal user
      pass: 'wwtcshylyftlwvwk'
  }});
  
  module.exports = transporter;