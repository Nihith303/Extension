import { borderAndFooter } from "./borderandfooter";

export const addLinksTable = (doc, links, startPosition, pageNumber) => {
  const categories = ["internal", "external", "withoutHref"];
  let yPosition = startPosition;

  if (yPosition > 297.0 / 2) {
    doc.addPage();
    pageNumber = borderAndFooter(doc, pageNumber);
    yPosition = 20;
  }

  // Table of Categories
  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Links Information by Category", 20, yPosition);

  categories.forEach((category) => {
    if (yPosition + 17 > 270) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber);
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
      const urlText = doc.splitTextToSize(href?.trim() || "No href", 85);
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

      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}`, 22, yPosition);

      // Set color to black for index and title
      doc.setTextColor(0, 0, 0); // Black color for index and title
      titleText.forEach((line, lineIndex) => {
        doc.text(line, 122, yPosition + lineIndex * 7);
      });

      // Set color to dark blue for clickable URL text
      doc.setTextColor(0, 0, 139); // Dark blue color for URLs
      urlText.forEach((line, lineIndex) => {
        doc.text(line, 34, yPosition + lineIndex * 7);
      });

      // Add clickable link
      const linkHeight = rowHeight;
      const linkStartY = yPosition - 5;
      doc.link(32, linkStartY, 88, linkHeight, { url: href });

      yPosition += rowHeight;
    });

    if (!links[category]?.length) {
      if (yPosition > 270) {
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber);
        yPosition = 20;
      }
      doc.setFontSize(10);
      doc.setTextColor(0, 255, 0);
      doc.text("No links available in this category.", 20, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
    }
  });

  return [yPosition + 10, pageNumber];
};
