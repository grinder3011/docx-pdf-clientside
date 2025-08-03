import { rgb } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';

export function renderParagraph(page, paragraph, font, y) {
  const fontSize = 12;
  const pageWidth = page.getWidth();
  const marginX = 50;
  const maxWidth = pageWidth - marginX * 2;
  let x = marginX;

  for (const run of paragraph.runs) {
    page.drawText(run.text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
      maxWidth,
      lineHeight: fontSize + 4,
    });

    x += font.widthOfTextAtSize(run.text, fontSize);
  }

  return y - fontSize - 20; // new y position after paragraph
}
