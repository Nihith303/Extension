export const addLinksDetails = (doc, links, startPosition) => {
  const categories = ["internal", "external"];
  let yPosition = startPosition;
  doc.setFontSize(14);
  doc.text("Links Summary", 10, yPosition);
  yPosition += 10;

  const linkCounts = [
    { label: "Total Links", value: links.total?.length || 0 },
    { label: "Internal Links", value: links.internal?.length || 0 },
    { label: "External Links", value: links.external?.length || 0 },
    { label: "Unique Links", value: links.unique?.length || 0 },
  ];

  linkCounts.forEach(({ label, value }) => {
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
  doc.text("Links Information by Category", 10, yPosition);

  categories.forEach((category) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 10;
    }

    yPosition += 10;
    doc.setFontSize(14);
    doc.text(
      `${category.charAt(0).toUpperCase() + category.slice(1)} Links`,
      10,
      yPosition
    );
    yPosition += 10;

    links[category]?.forEach(({ href, title }, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }
      doc.setFontSize(10);
      doc.text(`${index + 1}.`, 10, yPosition);
      doc.text("URL:", 20, yPosition);
      const urlText = doc.splitTextToSize(href, 170);
      urlText.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 10;
        }
        doc.text(line, 30, yPosition);
        yPosition += 7;
      });
      doc.text("Title:", 20, yPosition);
      const titleText = doc.splitTextToSize(title || "No title", 170);
      titleText.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 10;
        }
        doc.text(line, 30, yPosition);
        yPosition += 7;
      });
      yPosition += 5;
    });

    if (!links[category]?.length) {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }
      doc.setFontSize(10);
      doc.text("No links available.", 10, yPosition);
      yPosition += 10;
    }
  });
  return yPosition;
};
