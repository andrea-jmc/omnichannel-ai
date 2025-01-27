import puppeteer from "puppeteer";
import pdfjs from "pdfjs-dist";

export const pdfToImgage = async (encodedPdf: ArrayBuffer) => {
  const pdfAsArray = new Uint8Array(encodedPdf);

  // get number of pages
  const pdf = await pdfjs.getDocument(pdfAsArray).promise;
  const pageCount = pdf.numPages;

  // convert pdf to data url
  const pdfData = Buffer.from(encodedPdf).toString("base64");
  const dataUrl = `data:application/pdf;base64,${pdfData}`;

  // launch firefox
  const browser = await puppeteer.launch({
    browser: "firefox",
    args: ["-wait-for-browser", "--start-maximized"],
    executablePath: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
  );
  await page.setViewport({ width: 1200, height: 15000 });

  await page.goto(dataUrl, { waitUntil: "networkidle2" });

  // switch to presentation mode/fullscreen
  await page.keyboard.down("ControlLeft");
  await page.keyboard.down("AltLeft");
  await page.keyboard.press("KeyP");
  await page.keyboard.up("AltLeft");
  await page.keyboard.up("ControlLeft");

  const images: Uint8Array<ArrayBufferLike>[] = [];

  for (let i = 0; i < pageCount; i++) {
    //take screenshot and go to next page
    const image = await page.screenshot({ fullPage: true });
    images.push(image);
    await page.keyboard.press("KeyN");
  }

  await page.close();
  await browser.close();

  return images;
};
