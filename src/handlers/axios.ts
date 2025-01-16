import axios from "axios";

const version = process.env.VERSION;
const authorization = process.env.AUTHORIZATION;

export const getImageUrl = async (mediaId: string) => {
  const response = await axios.get<{ url: string }>(
    `https://graph.facebook.com/${version}/${mediaId}/`,
    { headers: { Authorization: `Bearer ${authorization}` } }
  );
  return response.data.url;
};

export const downloadMedia = async (url: string) => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${authorization}` },
  });
  const buffer = Buffer.from(response.data);
  return Buffer.concat([buffer]);
};
