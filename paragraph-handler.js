export function renderParagraph(page, paragraph, fonts, y) {
  const fontSize = 12;
  const pageWidth = page.getWidth();
  const marginX = 50;
  const maxWidth = pageWidth - marginX * 2;
  let x = marginX;

  for (const run of paragraph.runs) {
    // Choose font variant:
    let font = fonts.regular;
    if (run.bold && run.italic) font = fonts.boldItalic; // if you have one
    else if (run.bold) font = fonts.bold;
    else if (run.italic) font = fonts.italic;

    // Use color from run, or default black:
    const color = run.color ? PDFLib.rgb(run.color.r, run.color.g, run.color.b) : PDFLib.rgb(0, 0, 0);

    page.drawText(run.text, {
      x,
      y,
      size: fontSize,
      font,
      color,
      maxWidth,
      lineHeight: fontSize + 4,
    });

    x += font.widthOfTextAtSize(run.text, fontSize);

    // Underline workaround: draw a line below text if run.underline
    if (run.underline) {
      const textWidth = font.widthOfTextAtSize(run.text, fontSize);
      const underlineY = y - 2;
      page.drawLine({
        start: { x, y: underlineY },
        end: { x: x + textWidth, y: underlineY },
        thickness: 0.5,
        color,
      });
    }
  }

  return y - fontSize - 20;
}
