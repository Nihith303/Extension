export const addImageDetails = (doc, images, startPosition) => {
  let yPosition = startPosition;

  doc.setFontSize(14);
  doc.text("Image Information", 10, yPosition);
  yPosition += 10;

  const imageCounts = [
    { label: "Total Images", value: images.total?.length || 0 },
    { label: "Without ALT", value: images.noAlt?.length || 0 },
    { label: "Without Desc", value: images.noLongDesc?.length || 0 },
    { label: "Without SRC", value: images.noSrc?.length || 0 },
  ];

  imageCounts.forEach(({ label, value }) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 10;
    }
    doc.setFontSize(12);
    doc.text(`${label}`, 10, yPosition);
    doc.text(":", 40, yPosition);
    doc.setFontSize(10);
    doc.text(`${value}`, 50, yPosition);
    yPosition += 7;
  });
  yPosition += 10;
  doc.setFontSize(14);
  doc.text("Image Information by Category", 10, yPosition);
  yPosition += 10;

  // Define categories and their corresponding image sets
  const categories = [
    { label: "Without ALT", data: images.noAlt || [] },
    { label: "Without SRC", data: images.noSrc || [] },
    { label: "Without Description", data: images.noLongDesc || [] },
  ];

  categories.forEach(({ label, data }) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 10;
    }

    doc.setFontSize(12);
    doc.text(label, 10, yPosition);
    yPosition += 7;

    if (data.length === 0) {
      doc.setFontSize(10);
      doc.text("No images in this category.", 20, yPosition);
      yPosition += 10;
      return;
    }

    data.forEach(({ src, alt, longDesc }, index) => {
      if (yPosition > 271) {
        doc.addPage();
        yPosition = 10;
      }

      yPosition += 5;
      doc.setFontSize(10);
      doc.text(`${index + 1}.`, 10, yPosition);
      doc.text("SRC", 20, yPosition);
      doc.text(":", 38, yPosition);
      const srcText = doc.splitTextToSize(src || "No SRC", 160);
      srcText.forEach((line) => {
        if (yPosition > 271) {
          doc.addPage();
          yPosition = 10;
        }
        doc.text(line, 40, yPosition);
        yPosition += 7;
      });

      doc.text("ALT", 20, yPosition);
      doc.text(":", 38, yPosition);
      const altText = doc.splitTextToSize(alt || "No ALT", 160);
      altText.forEach((line) => {
        if (yPosition > 271) {
          doc.addPage();
          yPosition = 10;
        }
        doc.text(line, 40, yPosition);
        yPosition += 7;
      });

      doc.text("Description", 20, yPosition);
      doc.text(":", 38, yPosition);
      const descText = doc.splitTextToSize(longDesc || "No Description", 160);
      descText.forEach((line) => {
        if (yPosition > 271) {
          doc.addPage();
          yPosition = 10;
        }
        doc.text(line, 40, yPosition);
        yPosition += 7;
      });
    });
  });

  return yPosition;
};
