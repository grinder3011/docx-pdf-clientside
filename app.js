const fileInput = document.getElementById("docxFile");
const convertBtn = document.getElementById("convertBtn");
const outputDiv = document.getElementById("output");

let docxFile;

fileInput.addEventListener("change", (e) => {
  docxFile = e.target.files[0];
  convertBtn.disabled = !docxFile;
  outputDiv.textContent = "";
});

convertBtn.addEventListener("click", async () => {
  if (!docxFile) return;

  outputDiv.textContent = "Reading DOCX file...";

  try {
    // Step 1: Unzip DOCX
    const zip = await JSZip.loadAsync(docxFile);
    const documentXml = await zip.file("word/document.xml").async("string");

    // Step 2: Parse XML and extract paragraphs
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(documentXml, "application/xml");
    const paragraphs = Array.from(xmlDoc.getElementsByTagName("w:p"));

    // Extract plain text from paragraphs
    const texts = paragraphs.map((p) => {
      const textNodes = p.getElementsByTagName("w:t");
      return Array.from(textNodes)
        .map((t) => t.textContent)
        .join("");
    });

    outputDiv.textContent = "Generating PDF...";

    // Step 3: Create PDF with pdf-lib
    const { PDFDocument, StandardFonts, rgb } = PDFLib;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    let y = pageHeight - 50;

    for (const text of texts) {
      if (y < 50) {
        // Add new page if running out of space
        y = pageHeight - 50;
        page = pdfDoc.addPage();
      }
      page.drawText(text, {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: pageWidth - 100,
        lineHeight: fontSize + 4,
      });
      y -= fontSize + 20;
    }

    const pdfBytes = await pdfDoc.save();

    // Step 4: Provide download link
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "converted.pdf";
    link.textContent = "Download your PDF";
    link.style.display = "block";
    link.style.marginTop = "1rem";

    outputDiv.textContent = "";
    outputDiv.appendChild(link);

  } catch (err) {
    outputDiv.textContent = "Error: " + err.message;
  }
});
