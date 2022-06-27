const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.USERAUTHFORSENDINGMAIL, 
      pass: process.env.USERAUTHFORSENDINGMAILPASSWORD
  }});
  
  module.exports = transporter;