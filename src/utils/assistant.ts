// import { User } from "../types/schemas";

// export const parseFinalMessage = (message: string): User | null => {
//   const newAnswer = message
//     .replaceAll(/\n/g, " ")
//     .replaceAll(",", " ")
//     .replaceAll("  ", " ");

//   const nameMatch = newAnswer.match(/name:/) ?? newAnswer.match(/nombre:/);
//   const idMatch = newAnswer.match(/id:/);
//   const phoneMatch = newAnswer.match(/phone:/) ?? newAnswer.match(/teléfono:/);
//   const emailMatch = newAnswer.match(/email:/) ?? newAnswer.match(/correo:/);

//   if (nameMatch && idMatch && phoneMatch && emailMatch) {
//     const words = newAnswer.split(" ");

//     const nameIndex = words.indexOf(nameMatch[0]);
//     const idIndex = words.indexOf(idMatch[0]);
//     const phoneIndex = words.indexOf(phoneMatch[0]);
//     const emailIndex = words.indexOf(emailMatch[0]);

//     const email = words.slice(emailIndex + 1, emailIndex + 2).join(" ");

//     const payload = {
//       name: words.slice(nameIndex + 1, idIndex).join(" "),
//       id: words.slice(idIndex + 1, phoneIndex).join(" "),
//       phone: words.slice(phoneIndex + 1, emailIndex).join(" "),
//       email:
//         email.charAt(email.length - 1) === "."
//           ? email.substring(0, email.length - 1)
//           : email,
//     };
//     return payload;
//   }
//   return null;
// };
