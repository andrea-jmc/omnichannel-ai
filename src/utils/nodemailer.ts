import nodemailer from "nodemailer";
import { deleteUserData } from "./node-json-db";

const user = process.env.NODEMAILER_USER;
const pass = process.env.NODEMAILER_PASSWORD;
const destination = process.env.NODEMAILER_DESTINATION;

const transporter = nodemailer.createTransport({
  host: "mail.ingenieria.digital",
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
});

export const sendMail = (text: string, id: string) => {
  const mailOptions = {
    from: user,
    to: destination,
    subject: "Este correo salió de mi endpoint",
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      deleteUserData(id);
    }
  });
};
