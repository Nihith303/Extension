import { borderAndFooter } from "./borderandfooter";

export const addMetaLinksDetails = (doc, info, startPosition, pageNumber) => {
  const metaLinks = [
    { label: "Title", value: info.title },
    { label: "Description", value: info.description },
    { label: "Canonical", value: info.canonical },
    { label: "URL", value: info.url },
    { label: "Language", value: info.lang },
    { label: "Robots Meta", value: info.robots },
    { label: "X-Robots Meta", value: info.xRobots },
  ];

  // Title of the Report
  pageNumber = borderAndFooter(doc, pageNumber); // Use the imported function
  doc.setFontSize(16);
  doc.setTextColor(0, 123, 255);
  doc.setFont(undefined, "bold");
  doc.text("Website SEO Report", 105, 20, { align: "center" });

  doc.setFontSize(14);
  doc.setFont(undefined, "normal");
  doc.text("Meta Links Data", 20, startPosition);
  let yPosition = startPosition + 10;

  metaLinks.forEach((item) => {
    if (yPosition > 280) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber);
      yPosition = 20;
    }

    // Set label text
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${item.label}`, 20, yPosition);
    doc.text(":", 50, yPosition);

    doc.setFontSize(10);
    if (item.value === "Not Available") {
      doc.setTextColor(255, 0, 0); // Red color for "Not Available"
    } else {
      doc.setTextColor(0, 0, 0); // Default black color
    }

    // Wrap and display text
    const pageWidth = 140;
    const wrappedText = doc.splitTextToSize(item.value, pageWidth);

    wrappedText.forEach((line) => {
      if (yPosition > 280) {
        pageNumber++;
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber); // Use the imported function
        yPosition = 20;
      }
      doc.text(line, 55, yPosition);
      yPosition += 7;
    });
  });

  return [yPosition + 15, pageNumber];
};
