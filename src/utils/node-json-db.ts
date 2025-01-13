import { JsonDB, Config } from "node-json-db";
import {
  AddDataRequest,
  CreateUserRequest,
  UserDataObject,
} from "../types/node-json-db";
import { sendMail } from "./nodemailer";

const db = new JsonDB(new Config("localDataBase", true, false, "/"));

export const createUser = async ({ id, ...data }: CreateUserRequest) => {
  const payload: UserDataObject = {
    id,
    ...data,
    facturasFarmacia: [],
    facturasLab: [],
    form: "",
    ordenesLab: [],
    recetas: [],
    recibosConsultas: [],
    resultados: [],
  };
  await db.push(`/${id}`, payload);
};

export const addForm = async ({ id, value }: AddDataRequest) => {
  await db.push(`/${id}/form`, value, true);
};

export const addToArray = async (
  { id, value }: AddDataRequest,
  name: string
) => {
  await db.push(`/${id}/${name}[]`, value, true);
};

export const sendUserData = async (id: string) => {
  const user = await db.getObject<UserDataObject>(`/${id}`);
  const text = `Esta es la info de prueba del usuario:\nnombre: ${
    user.name
  }\ncorreo: ${user.email}\ncuenta: ${user.account}\nformulario: ${
    user.form
  }\nrecibos de consultas:${user.recibosConsultas.join(
    ",\n"
  )}\nrecetas: ${user.recetas.join(
    ",\n"
  )}\nfacturas de farmacias: ${user.facturasFarmacia.join(
    ",\n"
  )}\nórdenes de laboratorio: ${user.ordenesLab.join(
    ",\n"
  )}\nfacturas de laboratorio: ${user.facturasLab.join(
    ",\n"
  )}\nresultados: ${user.resultados.join("'\n")}`;

  sendMail(text);
};
