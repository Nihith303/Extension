export const borderAndFooter = (doc, pageNumber) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Draws the border
  doc.setDrawColor(0, 0, 0);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Adding Watermark to the page
  const watermarkText = "Digispot.AI";
  doc.setFontSize(70);
  doc.setTextColor(230, 230, 230);
  doc.text(watermarkText, pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });

  // Add footer text and page number
  doc.setFontSize(10);
  doc.setTextColor(222, 149, 149); // Pink color.
  const footerurl = "https://digispot.ai";
  const headertext = "Report by Digispot.AI";

  // Adding footertext
  doc.setFont(undefined, "bold");
  doc.text(headertext, pageWidth - 20, 5, {
    align: "right",
  });

  doc.text(`${pageNumber}`, pageWidth / 2, pageHeight - 3, { align: "center" });
  // Adding footerurl
  const xPosition = pageWidth - 20;
  const yPosition = pageHeight - 3;
  doc.setFont(undefined, "normal");
  doc.setTextColor(0, 0, 139);
  doc.text(footerurl, xPosition, yPosition, {
    align: "right",
  });
  const textWidth = doc.getTextWidth(footerurl);
  doc.setDrawColor(0, 0, 139);
  doc.line(xPosition - textWidth, yPosition + 1, xPosition, yPosition + 1);
  doc.link(
    pageWidth - 20 - doc.getTextWidth(footerurl),
    pageHeight - 12,
    doc.getTextWidth(footerurl),
    11,
    { url: footerurl }
  );
  doc.setTextColor(0, 0, 0);
  return pageNumber + 1;
};
