import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv";
import transporter from "../config/transporter.js";
import handlebarOptions from "../config/handlebarOptions.js";

dotenv.config();

// Attach Handlebars to the transporter
transporter.use("compile", hbs(handlebarOptions));

// Send Mail template
export const sendMail = async (to, subject, template, context) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject,
      template,
      context,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
    throw error;
  }
};
