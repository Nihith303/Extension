import { borderAndFooter } from "./borderandfooter";

export const addLinksSummary = (doc, links, startPosition, pageNumber) => {
  let yPosition = startPosition;

  // Title of the Links Summary
  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Links Summary", 20, yPosition);
  yPosition += 10;

  // Summary Section
  const linkCounts = [
    { label: "Total Links", value: links.total?.length || 0 },
    { label: "Internal Links", value: links.internal?.length || 0 },
    { label: "External Links", value: links.external?.length || 0 },
    { label: "Without href", value: links.withoutHref?.length || 0 },
    { label: "Unique Links", value: links.unique?.length || 0 },
  ];

  linkCounts.forEach(({ label, value }) => {
    if (yPosition + 7 > 270) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber);
      yPosition = 20;
    }

    // Set default text properties
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${label}`, 20, yPosition);
    doc.text(":", 50, yPosition);

    // Change text color to red if value is 0
    if (value === 0 || (label === "Without href" && value > 0)) {
      doc.setTextColor(255, 0, 0); // Red
    } else {
      doc.setTextColor(0, 0, 0); // Black
    }

    // Print value
    doc.setFontSize(10);
    doc.text(`${value}`, 60, yPosition);
    yPosition += 7;
  });

  return [yPosition + 15, pageNumber];
};
