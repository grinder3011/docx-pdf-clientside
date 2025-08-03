export function renderParagraph(page, paragraph, fonts, y) {
  const fontSize = 12;
  const pageWidth = page.getWidth();
  const marginX = 50;
  const maxWidth = pageWidth - marginX * 2;
  let x = marginX;

  for (const run of paragraph.runs) {
    // Choose font variant:
    let font = fonts.regular;
    if (run.bold && run.italic && fonts.boldItalic) font = fonts.boldItalic;
    else if (run.bold && fonts.bold) font = fonts.bold;
    else if (run.italic && fonts.italic) font = fonts.italic;

    // Defensive color extraction:
    const r = run.color && typeof run.color.r === 'number' ? run.color.r : 0;
    const g = run.color && typeof run.color.g === 'number' ? run.color.g : 0;
    const b = run.color && typeof run.color.b === 'number' ? run.color.b : 0;
    const color = PDFLib.rgb(r, g, b);

    // Draw text
    page.drawText(run.text, {
      x,
      y,
      size: fontSize,
      font,
      color,
      maxWidth,
      lineHeight: fontSize + 4,
    });

    // Calculate text width for positioning and underline
    const textWidth = font.widthOfTextAtSize(run.text, fontSize);

    // Draw underline if needed
    if (run.underline) {
      const underlineY = y - 2;
      page.drawLine({
        start: { x, y: underlineY },
        end: { x: x + textWidth, y: underlineY },
        thickness: 0.5,
        color,
      });
    }

    // Move x forward for next run
    x += textWidth;
  }

  return y - fontSize - 20;
}
