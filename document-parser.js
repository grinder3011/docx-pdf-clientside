import { parseRunStyles } from './styling.js';

export function parseDocx(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

  const paragraphs = [];
  const pResult = xmlDoc.evaluate(
    `//*[local-name()='p']`,
    xmlDoc,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    null
  );

  let pNode = pResult.iterateNext();
  while (pNode) {
    const runs = [];

    // Get all <w:r> inside this paragraph
    const rResult = xmlDoc.evaluate(
      `.//*[local-name()='r']`,
      pNode,
      null,
      XPathResult.ORDERED_NODE_ITERATOR_TYPE,
      null
    );

    let rNode = rResult.iterateNext();
    while (rNode) {
      // Extract text inside <w:t> (can be multiple)
      const tResult = xmlDoc.evaluate(
        `.//*[local-name()='t']`,
        rNode,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
      );

      let text = '';
      let tNode = tResult.iterateNext();
      while (tNode) {
        text += tNode.textContent;
        tNode = tResult.iterateNext();
      }

      if (text.length > 0) {
        // Parse styles from this run node
        const style = parseRunStyles(rNode);
        runs.push({ text, ...style });
      }

      rNode = rResult.iterateNext();
    }

    paragraphs.push({ runs });
    pNode = pResult.iterateNext();
  }

  return paragraphs;
}
