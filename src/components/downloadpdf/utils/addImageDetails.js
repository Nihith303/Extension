import { borderAndFooter } from "./borderandfooter";

// Function to add the summary section
export const addImageSummary = (doc, images, startPosition, pageNumber) => {
  let yPosition = startPosition;
  const leftMargin = 20;
  const pageHeight = 290;

  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Image Information", leftMargin, yPosition);
  yPosition += 10;

  const imageCounts = [
    { label: "Total Images", value: images.total?.length || 0 },
    { label: "Without ALT", value: images.noAlt?.length || 0 },
    { label: "Without Desc", value: images.noLongDesc?.length || 0 },
    { label: "Without SRC", value: images.noSrc?.length || 0 },
  ];

  imageCounts.forEach(({ label, value }) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber); // Add border and footer
      yPosition = 20; // Reset yPosition with top padding
    }

    // Set label text color
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${label}`, leftMargin, yPosition);
    doc.text(":", leftMargin + 30, yPosition);

    // Check if value is greater than 0 and change color to red if true
    doc.setFontSize(10);
    if (value > 0 && label !== "Total Images") {
      doc.setTextColor(255, 0, 0);
    } else {
      doc.setTextColor(0, 0, 0);
    }

    // Print value
    doc.text(`${value}`, leftMargin + 40, yPosition);
    yPosition += 7;
  });

  return [yPosition + 15, pageNumber];
};
