export const addLinksDetails = (doc, links, startPosition) => {
  const categories = ["internal", "external"];
  let yPosition = startPosition;
  doc.setFontSize(14);
  doc.text("Links Summary", 10, yPosition);
  yPosition += 10;

  // Summary Section
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

    // Table Headers
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.rect(10, yPosition - 5, 12, 7); // Index header border with padding
    doc.rect(22, yPosition - 5, 108, 7); // URL header border
    doc.rect(130, yPosition - 5, 70, 7); // Title header border
    doc.text("Index", 12, yPosition);
    doc.text("URL", 24, yPosition);
    doc.text("Title", 132, yPosition);
    yPosition += 7;
    doc.setFont(undefined, "normal");

    links[category]?.forEach(({ href, title }, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.rect(10, yPosition - 5, 12, 7); // Index header border with padding
        doc.rect(22, yPosition - 5, 108, 7); // URL header border
        doc.rect(130, yPosition - 5, 70, 7); // Title header border
        doc.text("Index", 12, yPosition);
        doc.text("URL", 24, yPosition);
        doc.text("Title", 132, yPosition);
        yPosition += 7;
        doc.setFont(undefined, "normal");
      }

      const urlText = doc.splitTextToSize(href.trim(), 100);
      const titleText = doc.splitTextToSize(title?.trim() || "No title", 60);

      const rowHeight = Math.max(urlText.length, titleText.length) * 7;

      doc.rect(10, yPosition - 5, 12, rowHeight); // Index border with padding
      doc.rect(22, yPosition - 5, 108, rowHeight); // URL border
      doc.rect(130, yPosition - 5, 70, rowHeight); // Title border

      doc.text(`${index + 1}`, 12, yPosition);

      urlText.forEach((line, lineIndex) => {
        doc.text(line, 24, yPosition + lineIndex * 7);
      });

      titleText.forEach((line, lineIndex) => {
        doc.text(line, 132, yPosition + lineIndex * 7);
      });

      yPosition += rowHeight;
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
