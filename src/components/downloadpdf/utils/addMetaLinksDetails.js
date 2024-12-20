export const addMetaLinksDetails = (doc, metaLinks, startPosition) => {
  doc.setFontSize(14);
  doc.text("Meta Links Data", 10, startPosition);
  let yPosition = startPosition + 10;
  metaLinks.forEach((item) => {
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 10;
    }
    doc.setFontSize(12);
    doc.text(`${item.label}`, 10, yPosition);
    doc.text(":", 40, yPosition);
    doc.setFontSize(10);
    const pageWidth = 140;
    const wrappedText = doc.splitTextToSize(
      item.value || "Not Available",
      pageWidth
    );

    wrappedText.forEach((line) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 10;
      }
      doc.text(line, 45, yPosition);
      yPosition += 7;
    });
  });
  return yPosition;
};
