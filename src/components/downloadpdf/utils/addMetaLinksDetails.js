export const addMetaLinksDetails = (doc, info, startPosition) => {
  const metaLinks = [
    { label: "Title", value: info.title },
    { label: "Description", value: info.description },
    { label: "Canonical", value: info.canonical },
    { label: "URL", value: info.url },
    { label: "Language", value: info.lang },
    { label: "Robots Meta", value: info.robots },
    { label: "X-Robots Meta", value: info.xRobots },
  ];
  // Title of the Report.
  doc.setFontSize(16);
  doc.text("Website SEO Report", 105, 10, { align: "center" });
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
