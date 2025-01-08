import axios from "axios";

const version = process.env.VERSION;
const phoneId = process.env.PHONE_NUMBER_ID;
const authorization = process.env.AUTHORIZATION;

export const sendTemplate = async (destination: string) => {
  const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;
  const headers = {
    Authorization: `Bearer ${authorization}`,
    "Content-Type": "application/json",
  };
  const data = {
    messaging_product: "whatsapp",
    to: destination,
    type: "template",
    template: { name: "hello_world", language: { code: "en_US" } },
  };
  const response = await axios.post(url, data, { headers });
  return response;
};

export const sendWhatsappMessage = async (
  message: string,
  destination: string
) => {
  const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;
  const headers = {
    Authorization: `Bearer ${authorization}`,
    "Content-Type": "application/json",
  };
  const data = {
    messaging_product: "whatsapp",
    to: destination,
    type: "text",
    text: { preview_url: false, body: message },
  };
  const response = await axios.post(url, data, { headers });
  return response;
};
