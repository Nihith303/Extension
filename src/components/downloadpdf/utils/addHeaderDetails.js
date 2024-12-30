import { borderAndFooter } from "./borderandfooter";

let columnWidth = 50;
let columnGap = 10;
let startX = 20;

export const addHeaderDetails = (
  doc,
  headersData,
  startPosition,
  pageNumber,
  recommendations
) => {
  let yPosition = startPosition;
  const columnX = startX + 2 * (columnWidth + columnGap);
  const pageHeight = doc.internal.pageSize.height; // Page height
  const marginTop = 20; // Top margin
  const marginBottom = 20; // Bottom margin
  const marginLeft = 10;

  if (yPosition > 297.0 * (3 / 4)) {
    yPosition = 20;
  }

  // Title
  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Headers Information", columnX, yPosition);
  yPosition += 10;

  // Content
  const headerCounts = headersData.counts;
  Object.entries(headerCounts).forEach(([header, count]) => {
    doc.setFontSize(12);

    if ((header === "h1" || header === "h2") && count === 0) {
      doc.setTextColor(255, 0, 0); // Red
      if (header === "h1")
        recommendations.push("No H1 tags found. Add an H1 tag for better SEO.");
      if (header === "h2")
        recommendations.push(
          "No H2 tags found. Consider using H2 tags for subheadings."
        );
    } else {
      doc.setTextColor(0, 0, 0); // Black
    }

    doc.text(`${header.toUpperCase()}`, columnX, yPosition);
    doc.text(`: ${count}`, columnX + columnWidth / 5, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Add header hierarchy check warning BEFORE the header details
  const isHierarchyValid = checkHeaderHierarchy(headersData.headers);
  if (!isHierarchyValid) {
    recommendations.push(
      "The headers do not follow a proper hierarchy. Fix their structure."
    );
  }

  // Write recommendations above the "Header Details in proper hierarchy"
  if (recommendations.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(255, 0, 0);
    doc.text("Recommendations:", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    recommendations.forEach((rec) => {
      if (yPosition > pageHeight - marginBottom) {
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber);
        yPosition = marginTop;
      }
      doc.setFont("ZapfDingbats");
      doc.text(String.fromCharCode(334), 20, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(`${rec}`, 24, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
  }

  if (yPosition > 297.0 * (3 / 4)) {
    doc.addPage();
    pageNumber = borderAndFooter(doc, pageNumber);
    yPosition = 10;
  }
  yPosition += 10;
  // Add detailed header content
  doc.setFontSize(14); // Unified font size
  doc.setTextColor(0, 123, 255);
  doc.text("Header Details in proper hierarchy", 105, yPosition, {
    align: "center",
  });
  yPosition += 10;

  let headerOrder = ["h1", "h2", "h3", "h4", "h5", "h6"];
  headerOrder.forEach((tag) => {
    const filteredHeaders = headersData.headers.filter(
      (header) => header.tag === tag
    );

    filteredHeaders.forEach(({ tag, text }) => {
      if (yPosition > pageHeight - marginBottom) {
        doc.addPage();
        pageNumber = borderAndFooter(doc, pageNumber);
        yPosition = marginTop;
      }

      doc.setFontSize(12); // Unified font size

      // Set text color to red if the count of h1 or h2 is 0
      if ((tag === "h1" || tag === "h2") && headerCounts[tag] === 0) {
        doc.setTextColor(255, 0, 0); // Red
      } else {
        doc.setTextColor(0, 0, 0); // Black
      }

      doc.text(`${tag.toUpperCase()}:`, marginLeft + 10, yPosition);

      const wrappedText = doc.splitTextToSize(text || "No Content", 160);
      wrappedText.forEach((line) => {
        if (yPosition > pageHeight - marginBottom) {
          doc.addPage();
          pageNumber = borderAndFooter(doc, pageNumber);
          yPosition = marginTop;
        }
        doc.text(line, marginLeft + 20, yPosition);
        yPosition += 4;
      });
      yPosition += 5;
    });
  });

  return [yPosition + 10, pageNumber];
};

// Function to check header hierarchy
const checkHeaderHierarchy = (headers) => {
  const headerOrder = ["h1", "h2", "h3", "h4", "h5", "h6"];
  let lastIndex = -1;

  for (const { tag } of headers) {
    const currentIndex = headerOrder.indexOf(tag);
    if (currentIndex < lastIndex) {
      return false; // Hierarchy violated
    }
    lastIndex = currentIndex;
  }

  return true; // Hierarchy is valid
};

// import { borderAndFooter } from "./borderandfooter";
// let columnWidth = 50;
// let columnGap = 10;
// let startX = 20;
// export const addHeaderDetails = (
//   doc,
//   headersData,
//   startPosition,
//   pageNumber
// ) => {
//   let yPosition = startPosition;
//   const columnX = startX + 2 * (columnWidth + columnGap);
//   const pageHeight = doc.internal.pageSize.height; // Page height
//   const marginTop = 20; // Top margin
//   const marginBottom = 20; // Bottom margin
//   const marginLeft = 10;

//   // Title
//   doc.setFontSize(14);
//   doc.setTextColor(0, 123, 255);
//   doc.text("Headers Information", columnX, yPosition);
//   yPosition += 10;

//   // Content
//   const headerCounts = headersData.counts;
//   Object.entries(headerCounts).forEach(([header, count]) => {
//     doc.setFontSize(12);

//     if ((header === "h1" || header === "h2") && count === 0) {
//       doc.setTextColor(255, 0, 0); // Red
//     } else {
//       doc.setTextColor(0, 0, 0); // Black
//     }

//     doc.text(`${header.toUpperCase()}`, columnX, yPosition);
//     doc.text(`: ${count}`, columnX + columnWidth / 5, yPosition);
//     yPosition += 7;
//   });

//   if (yPosition > 297.0 * (3 / 4)) {
//     doc.addPage();
//     pageNumber = borderAndFooter(doc, pageNumber);
//     yPosition = 10;
//   }
//   yPosition += 10;

//   // Add header hierarchy check warning BEFORE the header details
//   const isHierarchyValid = checkHeaderHierarchy(headersData.headers);
//   if (!isHierarchyValid) {
//     if (yPosition > pageHeight - marginBottom) {
//       doc.addPage();
//       pageNumber = borderAndFooter(doc, pageNumber);
//       yPosition = marginTop;
//     }

//     doc.setFontSize(12);
//     doc.setTextColor(255, 0, 0); // Red
//     doc.text(
//       "The Headers in your Website are not following the Hierarchy.",
//       20,
//       yPosition
//     );
//     yPosition += 15;
//   }

//   // Add detailed header content
//   doc.setFontSize(14); // Unified font size
//   doc.setTextColor(0, 123, 255);
//   doc.text("Header Details in proper hierarchy", 105, yPosition, {
//     align: "center",
//   });
//   yPosition += 10;
//   let headerOrder = ["h1", "h2", "h3", "h4", "h5", "h6"];

//   headerOrder.forEach((tag) => {
//     const filteredHeaders = headersData.headers.filter(
//       (header) => header.tag === tag
//     );

//     filteredHeaders.forEach(({ tag, text }) => {
//       if (yPosition > pageHeight - marginBottom) {
//         doc.addPage();
//         pageNumber = borderAndFooter(doc, pageNumber);
//         yPosition = marginTop;
//       }

//       doc.setFontSize(12); // Unified font size

//       // Set text color to red if the count of h1 or h2 is 0
//       if ((tag === "h1" || tag === "h2") && headerCounts[tag] === 0) {
//         doc.setTextColor(255, 0, 0); // Red
//       } else {
//         doc.setTextColor(0, 0, 0); // Black
//       }

//       doc.text(`${tag.toUpperCase()}:`, marginLeft + 10, yPosition);

//       const wrappedText = doc.splitTextToSize(text || "No Content", 160);
//       wrappedText.forEach((line) => {
//         if (yPosition > pageHeight - marginBottom) {
//           doc.addPage();
//           pageNumber = borderAndFooter(doc, pageNumber);
//           yPosition = marginTop;
//         }
//         doc.text(line, marginLeft + 20, yPosition);
//         yPosition += 4;
//       });
//       yPosition += 5;
//     });
//   });

//   return [yPosition + 10, pageNumber];
// };

// // Function to check header hierarchy
// const checkHeaderHierarchy = (headers) => {
//   const headerOrder = ["h1", "h2", "h3", "h4", "h5", "h6"];
//   let lastIndex = -1;

//   for (const { tag } of headers) {
//     const currentIndex = headerOrder.indexOf(tag);
//     if (currentIndex < lastIndex) {
//       return false; // Hierarchy violated
//     }
//     lastIndex = currentIndex;
//   }

//   return true; // Hierarchy is valid
// };
