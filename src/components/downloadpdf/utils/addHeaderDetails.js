export const addHeaderDetails = (doc, headersData, startPosition) => {
  let yPosition = startPosition;

  doc.setFontSize(14);
  doc.text("Headers Information", 10, yPosition);
  yPosition += 10;

  const headerCounts = headersData.counts;

  // Add header counts
  Object.entries(headerCounts).forEach(([header, count]) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 10;
    }
    doc.setFontSize(12);
    doc.text(`${header.toUpperCase()}:`, 10, yPosition);
    doc.setFontSize(10);
    doc.text(`${count}`, 40, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Add detailed header content with hierarchy
  doc.setFontSize(14);
  doc.text("Header Details", 10, yPosition);
  yPosition += 10;

  headersData.headers.forEach(({ tag, text }, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 10;
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
    doc.text(`${tag.toUpperCase()}:  `, (28 - fontSize) * 1.5, yPosition);

    const wrappedText = doc.splitTextToSize(text || "No Content", 170);
    wrappedText.forEach((line) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }
      doc.text(line, 30, yPosition);
      yPosition += 7;
    });
    yPosition += 5;
  });

  return yPosition;
};
