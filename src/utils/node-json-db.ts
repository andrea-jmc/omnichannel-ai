import { JsonDB, Config } from "node-json-db";
import {
  AddDataRequest,
  SaveUserRequest,
  UserDataObject,
} from "../types/node-json-db";
import { sendMail } from "./nodemailer";
import { imagesToPdf } from "./pdf";

const db = new JsonDB(new Config("localDataBase", true, false, "/"));

export const saveUser = async (req: SaveUserRequest) => {
  const { id } = req;
  await db.push(`/${id}`, req, false);
  buildEmail(id);
};

export const addDocument = async ({ id, document }: AddDataRequest) => {
  await db.push(`/${id}/documents[]`, document, true);
};

export const buildEmail = async (id: string) => {
  const user = await db.getObject<UserDataObject>(`/${id}`);
  const documentBuffer = await imagesToPdf(user.documents);

  sendMail(user, id, documentBuffer);
};

export const deleteUserData = async (id: string) => {
  await db.delete(`/${id}`);
};
