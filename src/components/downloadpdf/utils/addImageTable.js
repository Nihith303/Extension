import { borderAndFooter } from "./borderandfooter";

export const addImageTable = (doc, images, startPosition, pageNumber) => {
  let yPosition = startPosition;
  const leftMargin = 15;
  const cellPadding = 2;
  const columnWidths = [15, 115, 28, 28];
  const rowPadding = 2;
  const pageHeight = 290;

  if (yPosition > 297.0 * (3 / 4)) {
    doc.addPage();
    pageNumber = borderAndFooter(doc, pageNumber);
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Images", 105, yPosition, { align: "center" });
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
      // Add content to the table
      doc.setTextColor(0, 0, 0);
      doc.text(
        `${index + 1}`,
        leftMargin + cellPadding,
        yPosition + rowPadding + 2
      );

      // URL column - make it clickable
      srcText.forEach((line, lineIndex) => {
        if (line === "No SRC") {
          doc.setTextColor(255, 0, 0);
        } else {
          doc.setTextColor(0, 0, 139);
        }
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
        if (line === "No ALT") {
          doc.setTextColor(255, 0, 0);
        } else {
          doc.setTextColor(0, 0, 0);
        }
        doc.text(
          line,
          leftMargin + columnWidths[0] + columnWidths[1] + cellPadding,
          yPosition + rowPadding + 2 + lineIndex * 5
        );
      });

      descText.forEach((line, lineIndex) => {
        if (line === "No Description") {
          doc.setTextColor(255, 0, 0);
        } else {
          doc.setTextColor(0, 0, 0);
        }
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
