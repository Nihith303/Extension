import { borderAndFooter } from "./borderandfooter";

export const addLinksDetails = (doc, links, startPosition, pageNumber) => {
  const categories = ["internal", "external"];

  let yPosition = startPosition;

  // Draw border and footer for the first page
  //pageNumber = borderAndFooter(doc, pageNumber); // Use the imported function

  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Links Summary", 20, yPosition);
  yPosition += 10;

  // Summary Section
  const linkCounts = [
    { label: "Total Links", value: links.total?.length || 0 },
    { label: "Internal Links", value: links.internal?.length || 0 },
    { label: "External Links", value: links.external?.length || 0 },
    { label: "Unique Links", value: links.unique?.length || 0 },
  ];

  linkCounts.forEach(({ label, value }) => {
    if (yPosition + 7 > 270) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber); // Use the imported function
      yPosition = 20;
    }
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${label}`, 20, yPosition);
    doc.text(":", 50, yPosition);
    doc.setFontSize(10);
    doc.text(`${value}`, 60, yPosition);
    yPosition += 7;
  });

  yPosition += 10;
  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Links Information by Category", 20, yPosition);

  categories.forEach((category) => {
    if (yPosition + 17 > 270) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber); // Use the imported function
      yPosition = 20;
    }

    yPosition += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 123, 255);
    doc.text(
      `${category.charAt(0).toUpperCase() + category.slice(1)} Links`,
      20,
      yPosition
    );

    yPosition += 10;

    // Table Headers
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.rect(20, yPosition - 5, 12, 7); // Index header border with padding
    doc.rect(32, yPosition - 5, 88, 7); // URL header border
    doc.rect(120, yPosition - 5, 70, 7); // Title header border
    doc.text("Index", 22, yPosition);
    doc.text("URL", 34, yPosition);
    doc.text("Title", 122, yPosition);
    yPosition += 7;
    doc.setFont(undefined, "normal");

    links[category]?.forEach(({ href, title }, index) => {
      const urlText = doc.splitTextToSize(href.trim(), 85);
      const titleText = doc.splitTextToSize(title?.trim() || "No title", 68);

      const rowHeight = Math.max(urlText.length, titleText.length) * 7;

      if (yPosition + rowHeight > 285) {
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber);
        yPosition = 20;
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.rect(20, yPosition - 5, 12, 7); // Index header border with padding
        doc.rect(32, yPosition - 5, 88, 7); // URL header border
        doc.rect(120, yPosition - 5, 70, 7); // Title header border
        doc.text("Index", 22, yPosition);
        doc.text("URL", 34, yPosition);
        doc.text("Title", 122, yPosition);
        yPosition += 7;
        doc.setFont(undefined, "normal");
      }

      doc.rect(20, yPosition - 5, 12, rowHeight); // Index border with padding
      doc.rect(32, yPosition - 5, 88, rowHeight); // URL border
      doc.rect(120, yPosition - 5, 70, rowHeight); // Title border

      doc.text(`${index + 1}`, 22, yPosition);

      urlText.forEach((line, lineIndex) => {
        doc.text(line, 34, yPosition + lineIndex * 7);
      });

      titleText.forEach((line, lineIndex) => {
        doc.text(line, 122, yPosition + lineIndex * 7);
      });

      yPosition += rowHeight;
    });

    if (!links[category]?.length) {
      if (yPosition > 270) {
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber);
        yPosition = 20;
      }
      doc.setFontSize(10);
      doc.text("No links available.", 20, yPosition);
      yPosition += 10;
    }
  });

  return [yPosition, pageNumber];
};
