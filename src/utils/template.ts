export const PdfTemplate = (images: string[]) => {
  let innerHtml = ``;
  for (let i = 0; i < images.length; i++) {
    innerHtml += `<img
        src="${images[i]}"
        alt="pg. ${i}"
        style="width:100%;"
        />
        `;
  }
  return `<div>
      ${innerHtml}
    </div>`;
};
