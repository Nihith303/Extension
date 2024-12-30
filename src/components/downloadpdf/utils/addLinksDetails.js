export const addLinksSummary = (
  doc,
  links,
  startPosition,
  pageNumber,
  recommendations
) => {
  let yPosition = startPosition;

  if (yPosition > 297.0 * (3 / 4)) {
    yPosition = 20;
  }

  const linkCounts = [
    { label: "Total Links", value: links.total?.length || 0 },
    { label: "Internal Links", value: links.internal?.length || 0 },
    { label: "External Links", value: links.external?.length || 0 },
    { label: "Without href", value: links.withoutHref?.length || 0 },
    { label: "Unique Links", value: links.unique?.length || 0 },
  ];

  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Links Information", 80, yPosition);
  yPosition += 10;

  linkCounts.forEach(({ label, value }) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${label}`, 80, yPosition);

    if (value === 0 || (label === "Without href" && value > 0)) {
      doc.setTextColor(255, 0, 0); // Red
      if (label === "Without href") {
        recommendations.push(
          `"${value}"` + " links are missing 'href' attributes. Add valid URLs."
        );
      } else if (label === "Internal Links") {
        recommendations.push(
          "No internal links found. Ensure your website links to its own content."
        );
      } else if (label === "External Links") {
        recommendations.push(
          "No external links found. Include some authoritative external links."
        );
      }
    } else {
      doc.setTextColor(0, 0, 0); // Black
    }

    doc.text(`: ${value}`, 115, yPosition);
    yPosition += 7;
  });

  return pageNumber;
};

// const columnWidth = 50;
// const startX = 20;
// const columnGap = 10;
// export const addLinksSummary = (doc, links, startPosition, pageNumber) => {
//   let yPosition = startPosition;
//   const columnX = startX + columnWidth + columnGap;

//   // Title
//   doc.setFontSize(14);
//   doc.setTextColor(0, 123, 255);
//   doc.text("Links Information", columnX, yPosition);
//   yPosition += 10;

//   // Content
//   const linkCounts = [
//     { label: "Total Links", value: links.total?.length || 0 },
//     { label: "Internal Links", value: links.internal?.length || 0 },
//     { label: "External Links", value: links.external?.length || 0 },
//     { label: "Without href", value: links.withoutHref?.length || 0 },
//     { label: "Unique Links", value: links.unique?.length || 0 },
//   ];

//   linkCounts.forEach(({ label, value }) => {
//     doc.setFontSize(12);
//     doc.setTextColor(0, 0, 0);
//     doc.text(`${label}`, columnX, yPosition);

//     if (value === 0 || (label === "Without href" && value > 0)) {
//       doc.setTextColor(255, 0, 0); // Red
//     } else {
//       doc.setTextColor(0, 0, 0); // Black
//     }

//     doc.text(`: ${value}`, columnX + columnWidth / 2 + columnGap, yPosition);
//     yPosition += 7;
//   });

//   return pageNumber;
// };
