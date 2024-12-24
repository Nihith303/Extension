export const borderAndFooter = (doc, pageNumber) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Draws the border
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Adding Watermark to the page
  const watermarkText = "Digispot.AI";
  doc.setFontSize(70);
  doc.setTextColor(220, 220, 220);
  doc.text(watermarkText, pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });

  // Add footer text and page number
  doc.setFontSize(10);
  doc.setTextColor(222, 149, 149);
  const footerurl = "https://digispot.ai";
  const headertext = "Report by Digispot.AI";

  // Adding footertext
  doc.setFont(undefined, "bold");
  doc.text(headertext, pageWidth - 20, 5, {
    align: "right",
  });

  // Adding footerurl
  doc.setFont(undefined, "normal");
  doc.text(footerurl, pageWidth - 20, pageHeight - 3, {
    align: "right",
  });
  doc.link(
    pageWidth - 20 - doc.getTextWidth(footerurl),
    pageHeight - 13,
    doc.getTextWidth(footerurl),
    10,
    { url: footerurl }
  );

  doc.text(`${pageNumber}`, pageWidth / 2, pageHeight - 3, { align: "center" });
  doc.setTextColor(0, 0, 0);
  return pageNumber + 1;
};
