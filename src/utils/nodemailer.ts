import nodemailer from "nodemailer";
import { deleteUserData } from "./node-json-db";
import { UserDataObject } from "../types/node-json-db";

const emaiUser = process.env.NODEMAILER_USER;
const pass = process.env.NODEMAILER_PASSWORD;
const destination = process.env.NODEMAILER_DESTINATION;

const transporter = nodemailer.createTransport({
  host: "mail.ingenieria.digital",
  port: 465,
  secure: true,
  auth: {
    user: emaiUser,
    pass,
  },
});

export const sendMail = (
  user: UserDataObject,
  id: string,
  pdf: Uint8Array<ArrayBufferLike>
) => {
  const text = `Estos son los datos para el reclamo de ${user.paciente}.

  Información del seguro
  Nombre del titular: ${user.titular}
  Número de póliza: ${user.poliza}
  Número de certificado: ${user.certificado}
  Número de identidad: ${user.dni}
  Nombre del paciente: ${user.paciente}

  Información bancaria
  Cuenta: ${user.cuenta}
  Banco: ${user.banco}
  Moneda: ${user.tipo_cuenta}

  Se adjuntan los documentos enviados con el reclamo`;

  const mailOptions = {
    from: emaiUser,
    to: destination,
    subject: "Prueba de Reclamo " + user.paciente,
    text,
    attachments: [
      {
        filename: `Documentos ${user.paciente}.pdf`,
        content: Buffer.from(pdf),
        contentType: "application/pdf",
      },
    ],
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
