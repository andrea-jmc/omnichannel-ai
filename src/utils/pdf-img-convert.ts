import pdf2img from "pdf-img-convert";

export const pdfToImgage = async (encodedPdf: string) => {
  const pdfArray = await pdf2img.convert(encodedPdf, {
    base64: true,
    scale: 1,
  });
  return pdfArray;
};
