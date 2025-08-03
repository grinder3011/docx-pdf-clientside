import { parseDocumentXml } from './document-parser.js';
import { renderParagraph } from './paragraph-handler.js';

const { PDFDocument, StandardFonts, rgb } = PDFLib;

const fileInput = document.getElementById('docxFile');
const convertBtn = document.getElementById('convertBtn');
const outputDiv = document.getElementById('output');

let docxFile = null;

fileInput.addEventListener('change', (e) => {
  docxFile = e.target.files[0];
  convertBtn.disabled = !docxFile;
  outputDiv.textContent = '';
});

convertBtn.addEventListener('click', async () => {
  if (!docxFile) return;

  outputDiv.textContent = 'Reading DOCX...';

  try {
    const zip = await JSZip.loadAsync(docxFile);
    const documentXml = await zip.file('word/document.xml').async('string');

    const paragraphs = parseDocumentXml(documentXml);

    outputDiv.textContent = 'Generating PDF...';

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    let y = pageHeight - 50;

    for (const paragraph of paragraphs) {
      y = renderParagraph(page, paragraph, font, y);

      if (y < 50) {
        page = pdfDoc.addPage();
        y = pageHeight - 50;
      }
    }

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted.pdf';
    link.textContent = 'Download your PDF';
    link.style.display = 'block';
    link.style.marginTop = '1rem';

    outputDiv.textContent = '';
    outputDiv.appendChild(link);

  } catch (err) {
    outputDiv.textContent = 'Error: ' + err.message;
  }
});
