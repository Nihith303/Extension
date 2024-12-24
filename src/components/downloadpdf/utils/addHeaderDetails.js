import { borderAndFooter } from "./borderandfooter";

export const addHeaderDetails = (
  doc,
  headersData,
  startPosition,
  pageNumber
) => {
  const marginTop = 20; // Top margin
  const marginBottom = 20; // Bottom margin
  const marginleft = 10;
  const pageHeight = doc.internal.pageSize.height; // Page height
  let yPosition = startPosition;

  // Ensure startPosition is within the margin
  yPosition = Math.max(yPosition, marginTop);

  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Headers Information", 20, yPosition);
  yPosition += 10;

  const headerCounts = headersData.counts;

  // Add header counts
  Object.entries(headerCounts).forEach(([header, count]) => {
    if (yPosition > pageHeight - marginBottom) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber);
      yPosition = marginTop;
    }
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${header.toUpperCase()}`, 20, yPosition);
    doc.setFontSize(10);
    doc.text(`:          ${count}`, 50, yPosition);
    yPosition += 7;
  });

  if (yPosition > 297.0 * (3 / 4)) {
    doc.addPage();
    pageNumber = borderAndFooter(doc, pageNumber);
    yPosition = 10;
  }
  yPosition += 10;
  // Add detailed header content with hierarchy
  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Header Details", 20, yPosition);
  yPosition += 10;

  headersData.headers.forEach(({ tag, text }) => {
    if (yPosition > pageHeight - marginBottom) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber);
      yPosition = marginTop;
    }

    // Define font size based on header level
    const fontSizeMap = {
      h1: 18,
      h2: 14,
      h3: 12,
      h4: 11,
      h5: 10,
      h6: 9,
    };
    const fontSize = fontSizeMap[tag] || 10;

    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `${tag.toUpperCase()}:`,
      (28 - fontSize) * 1.5 + marginleft,
      yPosition
    );

    const wrappedText = doc.splitTextToSize(text || "No Content", 160);
    wrappedText.forEach((line) => {
      if (yPosition > pageHeight - marginBottom) {
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber);
        yPosition = marginTop;
      }
      doc.text(line, (28 - fontSize) * 1.5 + marginleft + 10, yPosition);
      yPosition += 7;
    });
    yPosition += 5;
  });

  return [yPosition + 10, pageNumber];
};
