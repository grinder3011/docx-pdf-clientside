// styling.js
export function parseRunStyles(runNode) {
  const style = {
    bold: false,
    italic: false,
    underline: false,
    color: '#000000',
  };

  const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

  const rPr = runNode.getElementsByTagNameNS(ns, 'rPr')[0];
  if (!rPr) return style;

  if (rPr.getElementsByTagNameNS(ns, 'b').length > 0) style.bold = true;
  if (rPr.getElementsByTagNameNS(ns, 'i').length > 0) style.italic = true;
  if (rPr.getElementsByTagNameNS(ns, 'u').length > 0) style.underline = true;

  const colorNode = rPr.getElementsByTagNameNS(ns, 'color')[0];
  if (colorNode) {
    const val = colorNode.getAttribute('w:val') || colorNode.getAttribute('val');
    if (val && val !== 'auto') {
      style.color = '#' + val;
    }
  }

  return style;
}
