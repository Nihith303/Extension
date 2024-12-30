import { borderAndFooter } from "./borderandfooter";
export const addImageSummary = (
  doc,
  images,
  startPosition,
  pageNumber,
  recommendations
) => {
  let yPosition = startPosition;
  if (yPosition > 297.0 * (3 / 4)) {
    doc.addPage();
    pageNumber = borderAndFooter(doc, pageNumber);
    yPosition = 20;
  }

  const imageCounts = [
    { label: "Total Images", value: images.total?.length || 0 },
    { label: "Without ALT", value: images.noAlt?.length || 0 },
    { label: "Without Desc", value: images.noLongDesc?.length || 0 },
    { label: "Without SRC", value: images.noSrc?.length || 0 },
  ];

  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Image Information", 20, yPosition);
  yPosition += 10;

  imageCounts.forEach(({ label, value }) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${label}`, 20, yPosition);

    if (value > 0 && label !== "Total Images") {
      doc.setTextColor(255, 0, 0); // Red
      if (label === "Without ALT") {
        recommendations.push(
          `"${value}"` +
            " images are missing 'ALT' attributes. Add descriptive ALT texts."
        );
      } else if (label === "Without SRC") {
        recommendations.push(
          `"${value}"` +
            " images are missing 'SRC' attributes. Ensure valid image sources."
        );
      } else {
        if (label === "Without Desc" && value === images.total?.length) {
          recommendations.push("Consider adding Description for the images.");
        } else {
          recommendations.push(
            `"${value}"` +
              " images are missing 'Description'. Add description for the images."
          );
        }
      }
    } else {
      doc.setTextColor(0, 0, 0); // Black
    }

    doc.text(`: ${value}`, 55, yPosition);
    yPosition += 7;
  });

  return pageNumber;
};

// let startX = 20;
// let columnWidth = 50;
// export const addImageSummary = (doc, images, startPosition, pageNumber) => {
//   let yPosition = startPosition;
//   const columnX = startX;

//   // Title
//   doc.setFontSize(14);
//   doc.setTextColor(0, 123, 255);
//   doc.text("Image Information", columnX, yPosition);
//   yPosition += 10;

//   // Content
//   const imageCounts = [
//     { label: "Total Images", value: images.total?.length || 0 },
//     { label: "Without ALT", value: images.noAlt?.length || 0 },
//     { label: "Without Desc", value: images.noLongDesc?.length || 0 },
//     { label: "Without SRC", value: images.noSrc?.length || 0 },
//   ];

//   imageCounts.forEach(({ label, value }) => {
//     doc.setFontSize(12);
//     doc.setTextColor(0, 0, 0);
//     doc.text(`${label}`, columnX, yPosition);

//     if (value > 0 && label !== "Total Images") {
//       doc.setTextColor(255, 0, 0); // Red
//     } else {
//       doc.setTextColor(0, 0, 0); // Black
//     }

//     doc.text(`: ${value}`, columnX + columnWidth / 2 + 10, yPosition);
//     yPosition += 7;
//   });

//   return pageNumber;
// };
