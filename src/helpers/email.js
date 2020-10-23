import nodemailer from "nodemailer";
import fs from "fs";
import util from "util";
import ejs from "ejs";
import path from "path";

export const amazonEmailValidation = email => {

  const amazonRegexValidator = /^[\w.+-]+@amazon\.com$/i;
  return amazonRegexValidator.test(email);

};

export const transporter = () => {

  const transportConfig = {
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  return nodemailer.createTransport(transportConfig);

};

export const sendEmail = async (config) => {

  const transport = transporter();

  const emailFile = path.join(__dirname, `/../views/emails/${config.file}.ejs`);

  const emailFileCompiled = ejs.compile(fs.readFileSync(emailFile, "utf8"));

  const html = emailFileCompiled(config.variables);

  const emailConfig = {
    from: "AMZL <noreplay@amazon.com>",
    to: config.user.email,
    subject: config.subject,
    html
  };

  const send = util.promisify(transport.sendMail, transport);
  return send.call(transport, emailConfig);

};
