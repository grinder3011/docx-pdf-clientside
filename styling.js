export function parseRunStyles(runNode) {
  const style = {
    bold: false,
    italic: false,
    underline: false,
    color: '#000000',
  };

  const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

  // Get the <w:rPr> run properties node
  const rPr = runNode.getElementsByTagNameNS(ns, 'rPr')[0];
  if (!rPr) return style;

  // Check for <w:b> (bold)
  if (rPr.getElementsByTagNameNS(ns, 'b').length > 0) {
    style.bold = true;
  }

  // Check for <w:i> (italic)
  if (rPr.getElementsByTagNameNS(ns, 'i').length > 0) {
    style.italic = true;
  }

  // Check for <w:u> (underline)
  if (rPr.getElementsByTagNameNS(ns, 'u').length > 0) {
    style.underline = true;
  }

  // Check for color <w:color w:val="FF0000"/>
  const colorNode = rPr.getElementsByTagNameNS(ns, 'color')[0];
  if (colorNode) {
    const val = colorNode.getAttribute('w:val') || colorNode.getAttribute('val');
    if (val && val !== 'auto') {
      style.color = '#' + val;
    }
  }

  return style;
}
