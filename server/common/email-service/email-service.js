const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require("path");


const createEmailService = (config) => {

  const transporter = nodemailer.createTransport(config);
  transporter.use('compile', hbs({
    viewPath: path.join(__dirname, "./templates"),
    extName: '.hbs',
    viewEngine: {
      partialsDir:  path.join(__dirname, "./templates/partials"),
      defaultLayout: false
    }

  }));

  return {
    sendEmail: (options) => {
      return transporter.sendMail(options).then((arg) => {
        console.log(`Send email to ${options.to} successfully!`);
        console.log(arg);
        return;
      }).catch(err =>{
        console.log(err);
        return Promise.reject(err);
      })
    }
  };
};

const emailService = createEmailService({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_AUTH_USERNAME,
    pass: process.env.GMAIL_AUTH_PASSWORD
  }
});

module.exports = emailService;