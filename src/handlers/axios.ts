// import axios from "axios";

// const version = process.env.VERSION;
// const authorization = process.env.AUTHORIZATION;

// export const getMediaUrl = async (mediaId: string) => {
//   const response = await axios.get<{ url: string; mime_type: string }>(
//     `https://graph.facebook.com/${version}/${mediaId}/`,
//     {
//       headers: { Authorization: `Bearer ${authorization}` },
//     }
//   );
//   return { url: response.data.url, mime_type: response.data.mime_type };
// };

// export const downloadMedia = async (url: string) => {
//   const response = await axios.get(url, {
//     headers: { Authorization: `Bearer ${authorization}` },
//     responseType: "arraybuffer",
//   });
//   return response.data;
// };
