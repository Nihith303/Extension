export const borderAndFooter = (doc, pageNumber) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Draws the border
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  //Adding Watermark to the page.
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
  doc.setFont(undefined, "bold");
  const footertext = "Report by Digispot.AI";
  doc.text(footertext, pageWidth - 20, pageHeight - 3, {
    align: "right",
  });
  doc.text(`${pageNumber}`, pageWidth / 2, pageHeight - 3, { align: "center" });
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");

  return pageNumber + 1;
};
