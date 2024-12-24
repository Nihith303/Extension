import { borderAndFooter } from "./borderandfooter";

export const addImageTable = (doc, images, startPosition, pageNumber) => {
  let yPosition = startPosition + 10;
  const leftMargin = 15;
  const cellPadding = 2;
  const columnWidths = [15, 85, 50, 30]; // Column widths for Index, URL, ALT, and Description
  const rowPadding = 2;
  const pageHeight = 290;

  if (yPosition > 297.0 / 2) {
    doc.addPage();
    pageNumber = borderAndFooter(doc, pageNumber);
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Image Information by Category", leftMargin, yPosition);
  yPosition += 10;

  const categories = [
    {
      label: "Without ALT",
      data: images.noAlt || [],
    },
    {
      label: "Without SRC",
      data: images.noSrc || [],
    },
    {
      label: "Without Description",
      data: images.noLongDesc || [],
      specialCondition:
        (images.noLongDesc?.length || 0) === (images.total?.length || 0),
      specialMessage: "All links in the website have no Description.",
    },
  ];

  categories.forEach(({ label, data, specialCondition, specialMessage }) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      pageNumber = borderAndFooter(doc, pageNumber); // Add border and footer
      yPosition = 20; // Reset yPosition with top padding
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 123, 255);
    doc.text(label, leftMargin, yPosition);
    yPosition += 7;

    if (specialCondition) {
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.setTextColor(255, 0, 0); // Red.
      doc.text(specialMessage, leftMargin + 10, yPosition);
      doc.setFont(undefined, "normal");
      yPosition += 15; // Add space after the message
      return;
    }

    if (data.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(0, 255, 0); // Green
      doc.text("No images in this category.", leftMargin + 10, yPosition);
      yPosition += 15;
      return;
    }

    doc.setFont(undefined, "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Index", leftMargin + cellPadding, yPosition + rowPadding + 2);
    doc.text(
      "URL",
      leftMargin + columnWidths[0] + cellPadding,
      yPosition + rowPadding + 2
    );
    doc.text(
      "ALT",
      leftMargin + columnWidths[0] + columnWidths[1] + cellPadding,
      yPosition + rowPadding + 2
    );
    doc.text(
      "Description",
      leftMargin +
        columnWidths[0] +
        columnWidths[1] +
        columnWidths[2] +
        cellPadding,
      yPosition + rowPadding + 2
    );

    // Draw the header border around each column
    doc.rect(leftMargin, yPosition, columnWidths[0], rowPadding + 5); // Index
    doc.rect(
      leftMargin + columnWidths[0],
      yPosition,
      columnWidths[1],
      rowPadding + 5
    );
    doc.rect(
      leftMargin + columnWidths[0] + columnWidths[1],
      yPosition,
      columnWidths[2],
      rowPadding + 5
    );
    doc.rect(
      leftMargin + columnWidths[0] + columnWidths[1] + columnWidths[2],
      yPosition,
      columnWidths[3],
      rowPadding + 5
    );
    yPosition += rowPadding + 5;

    doc.setFont(undefined, "normal");
    data.forEach(({ src, alt, longDesc }, index) => {
      const rowStartY = yPosition;

      const srcText = doc.splitTextToSize(
        src || "No SRC",
        columnWidths[1] - cellPadding * 2
      );
      const altText = doc.splitTextToSize(
        alt || "No ALT",
        columnWidths[2] - cellPadding * 2
      );
      const descText = doc.splitTextToSize(
        longDesc || "No Desc",
        columnWidths[3] - cellPadding * 2
      );

      const maxLines = Math.max(
        srcText.length,
        altText.length,
        descText.length
      );
      const rowHeightAdjusted = maxLines * 5 + rowPadding; // Adjust row height dynamically

      if (yPosition + rowHeightAdjusted > pageHeight - 20) {
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber); // Add border and footer
        yPosition = 20; // Reset yPosition with top padding
      }

      // Draw borders for each column in the row
      doc.rect(leftMargin, yPosition, columnWidths[0], rowHeightAdjusted); // Index
      doc.rect(
        leftMargin + columnWidths[0],
        yPosition,
        columnWidths[1],
        rowHeightAdjusted
      ); // URL
      doc.rect(
        leftMargin + columnWidths[0] + columnWidths[1],
        yPosition,
        columnWidths[2],
        rowHeightAdjusted
      ); // ALT
      doc.rect(
        leftMargin + columnWidths[0] + columnWidths[1] + columnWidths[2],
        yPosition,
        columnWidths[3],
        rowHeightAdjusted
      ); // Description

      // Add content to the table
      doc.text(
        `${index + 1}`,
        leftMargin + cellPadding,
        yPosition + rowPadding + 2
      );

      // URL column - make it clickable
      doc.setTextColor(0, 0, 139); // Dark blue color for URLs
      srcText.forEach((line, lineIndex) => {
        doc.text(
          line,
          leftMargin + columnWidths[0] + cellPadding,
          yPosition + rowPadding + 2 + lineIndex * 5
        );
      });

      // Add clickable link for URL
      doc.link(
        leftMargin + columnWidths[0] + cellPadding,
        yPosition + rowPadding + 2,
        columnWidths[1] - cellPadding * 2,
        rowHeightAdjusted,
        { url: src }
      );

      // ALT and Description columns
      doc.setTextColor(0, 0, 0); // Reset color for ALT and Description
      altText.forEach((line, lineIndex) => {
        doc.text(
          line,
          leftMargin + columnWidths[0] + columnWidths[1] + cellPadding,
          yPosition + rowPadding + 2 + lineIndex * 5
        );
      });

      descText.forEach((line, lineIndex) => {
        doc.text(
          line,
          leftMargin +
            columnWidths[0] +
            columnWidths[1] +
            columnWidths[2] +
            cellPadding,
          yPosition + rowPadding + 2 + lineIndex * 5
        );
      });

      yPosition += rowHeightAdjusted;
    });

    // Add spacing after each table
    yPosition += 15;
  });

  return [yPosition + 10, pageNumber];
};
