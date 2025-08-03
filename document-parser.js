export function parseDocumentXml(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  const paragraphs = [];

  const xpathResult = xmlDoc.evaluate(
    "//*[local-name()='p']",
    xmlDoc,
    null,
    XPathResult.ANY_TYPE,
    null
  );

  let pNode = xpathResult.iterateNext();

  while (pNode) {
    const runs = [];
    const runResult = xmlDoc.evaluate(
      ".//*[local-name()='r']",
      pNode,
      null,
      XPathResult.ANY_TYPE,
      null
    );

    let rNode = runResult.iterateNext();
    while (rNode) {
      const textResult = xmlDoc.evaluate(
        ".//*[local-name()='t']",
        rNode,
        null,
        XPathResult.ANY_TYPE,
        null
      );

      let tNode = textResult.iterateNext();
      let text = '';
      while (tNode) {
        text += tNode.textContent;
        tNode = textResult.iterateNext();
      }

      runs.push({ text });
      rNode = runResult.iterateNext();
    }

    paragraphs.push({ runs });
    pNode = xpathResult.iterateNext();
  }

  return paragraphs;
}
